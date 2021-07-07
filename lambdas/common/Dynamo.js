const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  async getAll(TableName) {
    const params = {
      TableName,
    };

    const news = await dynamoClient.scan(params).promise();
    return news;
  },

  async get(newsID, TableName) {
    const params = {
      TableName,
      Key: {
        newsID,
      },
    };

    const data = await documentClient.get(params).promise();
    console.log("response", data);

    if (!data || !data.Item) {
      throw Error(
        `There is an error fetching the data for the News ID of ${newsID} from ${TableName}`
      );
    }

    console.log(data);
    return data.Item;
  },

  async deleteByID(newsID, TableName) {
    const params = {
      TableName,
      Key: {
        newsID,
      },
    };

    return await documentClient.delete(params).promise();
  },

  async write(data, TableName) {
    if (!data.newsID) {
      throw Error("No ID on the data");
    }

    const params = {
      TableName,
      Item: data,
    };

    // CREATE THE REQUEST TO DOCUMENT CLIENT TO PUT THE DATA ON TABLE

    const response = await documentClient.put(params).promise();

    if (!response) {
      throw Error(
        `There was an error inserting ID OF ${data.newsID} in table ${TableName}`
      );
    }

    return data;
  },

  queryByGSIKeyIndex: async ({
    tableName,
    indexName,
    queryKey,
    queryValue,
  }) => {
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: "#queryKey = :hKey",
      ExpressionAttributeNames: {"#queryKey" : `${queryKey}`},
      ExpressionAttributeValues: {
        ":hKey": queryValue,
      },
    };
    console.log(tableName, indexName, queryKey, queryValue);
    const response = await documentClient.query(params).promise();
    console.log("response of city ", response);
    return response.Items || {};
  },

  queryByGSIKeyIndexNewsType: async ({
    tableName,
    indexName,
    queryKey,
    queryValue,
    rangeKey,
    rangeValue,
  }) => {
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: `#queryKey = :hKey and begins_with(${rangeKey}, :rKey)`,
      ExpressionAttributeNames: {"#queryKey" : `${queryKey}`},
      ExpressionAttributeValues: {
        ":hKey": queryValue,
        ":rKey": rangeValue,
      },
    };
    const response = await documentClient.query(params).promise();
    return response.Items || {};
  },

  queryByGSIKeyIndexHighlight: async ({
    tableName,
    indexName,
    queryKey,
    queryValue,
  }) => {
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: "#queryKey = :hKey",
      FilterExpression: "highlight >= :val",
      ExpressionAttributeNames: {"#queryKey" : `${queryKey}`},
      ExpressionAttributeValues: {
        ":hKey": queryValue,
        ":val": 1,
      },
    };
    const response = await documentClient.query(params).promise();
    return response.Items || {};
  },

  updateData: async ({
    tableName,
    primaryKey,
    primaryKeyValue,
    updateKey,
    updateValue,
  }) => {
    const params = {
      TableName: tableName,
      Key: { [primaryKey]: primaryKeyValue },
      UpdateExpression: `set ${updateKey} = :updateValue`,
      ExpressionAttributeValues: {
        ":updateValue": updateValue,
      },
    };

    return documentClient.update(params).promise();
  },

  updateHighlight: async ({ tableName, primaryKey, primaryKeyValue }) => {
    const params = {
      TableName: tableName,
      Key: { [primaryKey]: primaryKeyValue },
      UpdateExpression: "SET highlight = highlight + :val",
      ExpressionAttributeValues: {
        ":val": 1,
      },
    };
    return documentClient.update(params).promise();
  },

  // USER

  async writeUser(data, TableName) {
    if (!data.userID) {
      throw Error("No ID on the data");
    }

    const params = {
      TableName,
      Item: data,
    };

    // CREATE THE REQUEST TO DOCUMENT CLIENT TO PUT THE DATA ON TABLE

    const response = await documentClient.put(params).promise();

    if (!response) {
      throw Error(
        `There was an error inserting ID OF ${data.userID} in table ${TableName}`
      );
    }

    return data;
  },
};

module.exports = Dynamo;
