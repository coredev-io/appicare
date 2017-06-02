'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const encrypt = require('../lib/encrypt');
const moment = require('moment');

exports.endpoints = function(db){

    var endpoints = [

      {
          method: 'GET',
          path: '/',
          // config: { auth: 'jwt' },
          handler: function (request, reply) {

              reply.view('index', {
                  title: "appicare",
                  name: 'Tavo',
                  users: [
                    {id: 1, name: "miguel", email: "test@miguelgomez.io"},
                    {id: 2, name: "test", email: "test@test.es"},
                    {id: 3, name: "miguel", email: "test@miguelgomez.io"},
                    {id: 4, name: "test", email: "test@test.es"},
                    {id: 5, name: "miguel", email: "test@miguelgomez.io"},
                    {id: 6, name: "test", email: "test@test.es"},
                    {id: 7, name: "miguel", email: "test@miguelgomez.io"},
                    {id: 8, name: "test", email: "test@test.es"}
                  ]

                });
          }
      }];

    return endpoints;
};
