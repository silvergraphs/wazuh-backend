const tasksHandler = require('../tasks');

test('retrieve all tasks', () => {
  /**@type {Partial<import('aws-lambda').APIGatewayProxyEvent>}  */
  const mockedEvent = {
    resource: '/tasks',
    path: '/tasks',
    httpMethod: 'GET',
    queryStringParameters: null,
    pathParameters: null,
  };

  const mockedResponse = {
    statusCode: 200,
    body: {
      totalItems: 10,
      data: [
        {
          "user_id": 1,
          "id": 1,
          "title": "delectus aut autem",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 2,
          "title": "quis ut nam facilis et officia qui",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 3,
          "title": "fugiat veniam minus",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 4,
          "title": "et porro tempora",
          "completed": true
        },
        {
          "user_id": 1,
          "id": 5,
          "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 6,
          "title": "qui ullam ratione quibusdam voluptatem quia omnis",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 7,
          "title": "illo expedita consequatur quia in",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 8,
          "title": "quo adipisci enim quam ut ab",
          "completed": true
        },
        {
          "user_id": 1,
          "id": 9,
          "title": "molestiae perspiciatis ipsa",
          "completed": false
        },
        {
          "user_id": 1,
          "id": 10,
          "title": "illo est ratione doloremque quia maiores aut",
          "completed": true
        }
      ]
    }
  };

  return tasksHandler.getAllTasks(mockedEvent).then(result => {
    const parsedBody = JSON.parse(result.body);
    expect(result.statusCode).toBe(mockedResponse.statusCode);
    expect(parsedBody.totalItems).toEqual(mockedResponse.body.totalItems);
    expect(parsedBody.data).toEqual(mockedResponse.body.data);
  })

});

test('retrieve info for a single task', () => {
  /**@type {Partial<import('aws-lambda').APIGatewayProxyEvent>}  */
  const mockedEvent = {
    resource: '/tasks',
    path: '/tasks',
    httpMethod: 'GET',
    queryStringParameters: null,
    pathParameters: {id: 4},
  };

  const mockedResponse = {
    statusCode: 200,
    body: {
    "user_id": 1,
      "id": 4,
      "title": "et porro tempora",
      "completed": true
    }
  };

  return tasksHandler.getTask(mockedEvent).then(result => {
    const parsedBody = JSON.parse(result.body);
    expect(result.statusCode).toBe(mockedResponse.statusCode);
    expect(parsedBody).toEqual(mockedResponse.body);
  })

});