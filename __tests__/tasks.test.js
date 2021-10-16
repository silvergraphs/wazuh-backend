const handler = require('../tasks');

test('all tasks are shown', () => {
  /**@type {Partial<import('aws-lambda').APIGatewayProxyEvent>}  */
  const mockedEvent = {
    resource: '/tasks',
    path: '/tasks',
    httpMethod: 'GET',
    queryStringParameters: null,
    pathParameters: null,
  };

  const desiredResponse = {};
  expect(handler.getAllTasks(mockedEvent)).toBe(desiredResponse);
});