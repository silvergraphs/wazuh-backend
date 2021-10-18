"use strict";
const fs = require('fs');
const { get } = require('lodash');

/**
 * @param {Partial<import('aws-lambda').APIGatewayProxyEvent>} event - Lambda event
 */
module.exports.getAllUsers = async (event) => {
  let result = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: null,
  };

  try {
    console.log('Received event', event);
    // JSON users raw data
    const rawData = fs.readFileSync('users.json');
    const users = JSON.parse(rawData);
    const response = {
      totalItems: users.length,
      data: users,
    };
    result.statusCode = 200;
    result.headers = { 'Access-Control-Allow-Origin': '*' };
    result.body = JSON.stringify(response);
  } catch (error) {
    result.statusCode = 500
    console.error(error)
    result.body = {error: error.toString()}
  }

  return result;
};

/**
 * @param {Partial<import('aws-lambda').APIGatewayProxyEvent>} event - Lambda event
 */
module.exports.getUser = async (event) => {
  let result = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: null,
  };
  try {
    console.log('Received event', event);
    // Params
    const id = parseInt(get(event, 'pathParameters.id', null));
    // JSON users raw data
    const rawData = fs.readFileSync('users.json');
    const users = JSON.parse(rawData);

    const response = users.find(user => user.id === id) || {error: 'User with provided ID not found'}

    result.statusCode = 200;
    result.headers = { 'Access-Control-Allow-Origin': '*' };
    result.body = JSON.stringify(response);
  } catch (error) {
    result.statusCode = 500
    console.error(error)
    result.body = {error: error.toString()}
  }

  return result;
};

/**
 * @param {Partial<import('aws-lambda').APIGatewayProxyEvent>} event - Lambda event
 */
module.exports.getAllTasksFromUser = async (event) => {
  let result = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: null,
  };

  try {
    console.log('Received event', event);
    // Path Params
    const userId = parseInt(get(event, 'pathParameters.id', null));
    // QueryString Params
    const offset = parseInt(get(event, 'queryStringParameters.offset', 0));
    const limit = parseInt(get(event, 'queryStringParameters.limit', 10));
    const completed = get(event, 'queryStringParameters.completed', undefined);
    const title = get(event, 'queryStringParameters.title', '');
    // JSON tasks raw data
    const rawTasksData = fs.readFileSync('tasks.json');
    const rawUsersData = fs.readFileSync('users.json');
    let tasks = JSON.parse(rawTasksData);
    const users = JSON.parse(rawUsersData);
    let filteredTasks = [];

    // First find user provided in Path Param
    const user = users.find(user => user.id === userId)
    if (!user) {
      throw new Error('User with provided ID not found');
    }

    // Filter tasks by user
    tasks = tasks.filter(task => task.user_id === user.id)

    // Completed filter
    if (completed) {
      tasks.forEach(task => {
        if (completed === 'true') {
          task.completed && filteredTasks.push(task)
        } else if (completed === 'false') {
          !task.completed && filteredTasks.push(task)
        }
      })
    } else {
      filteredTasks = tasks;
    }
    // Offset reorder param
    offset && (filteredTasks = filteredTasks.slice(offset, filteredTasks.length));
    // Title filter
    title && (filteredTasks = filteredTasks.filter(task => task.title.includes(title)));
    // Limiter param
    filteredTasks = filteredTasks.slice(0, limit)

    const response = {
      totalItems: filteredTasks.length,
      data: filteredTasks,
    };

    result.statusCode = 200;
    result.headers = { 'Access-Control-Allow-Origin': '*' };
    result.body = JSON.stringify(response);
  } catch (error) {
    console.error(error)
    result.statusCode = 500;
    result.body = JSON.stringify({error: error.toString()})
  }
  return result;
};
