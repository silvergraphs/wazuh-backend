"use strict";
const fs = require('fs');
const { get } = require('lodash');

/**
 * @param {Partial<import('aws-lambda').APIGatewayProxyEvent>} event - Lambda event
 */
module.exports.getAllTasks = async (event) => {
   let result = {
      statusCode: 200,
      body: null,
   };

   try {
      console.log('Received event', event);
      // Params
      const offset = parseInt(get(event, 'queryStringParameters.offset', 0));
      const limit = parseInt(get(event, 'queryStringParameters.limit', 10));
      const completed = get(event, 'queryStringParameters.completed', undefined);
      const title = get(event, 'queryStringParameters.title', '');
      // JSON tasks raw data
      const rawData = fs.readFileSync('tasks.json');
      const rawTasks = JSON.parse(rawData);
      let filteredTasks = [];
      // Completed filter
     if (completed) {
       rawTasks.forEach(task => {
         if (completed === 'true') {
           task.completed && filteredTasks.push(task)
         } else if (completed === 'false') {
           !task.completed && filteredTasks.push(task)
         }
       })
     } else {
       filteredTasks = rawTasks;
     }
      // Title filter
     title && (filteredTasks = filteredTasks.filter(task => task.title.includes(title)));
     // Offset reorder param
     offset && (filteredTasks = filteredTasks.slice(offset, filteredTasks.length));
      // Limiter param
      filteredTasks = filteredTasks.slice(0, limit)

      const response = {
         totalItems: filteredTasks.length,
         data: filteredTasks,
      };

      result.statusCode = 200;
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
module.exports.getTask = async (event) => {
  let result = {
    statusCode: 200,
    body: null,
  };
  try {
    console.log('Received event', event);
    // Params
    const id = parseInt(get(event, 'pathParameters.id', null));
    // JSON tasks raw data
    const rawData = fs.readFileSync('tasks.json');
    const rawTasks = JSON.parse(rawData);

    const response = rawTasks.find(task => task.id === id) || {error: 'Task with provided ID not found'}

    result.statusCode = 200;
    result.body = JSON.stringify(response);
  } catch (error) {
    result.statusCode = 500
    console.error(error)
    result.body = {error: error.toString()}
  }

  return result;
};
