'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const encrypt = require('../lib/encrypt');
const JWT         = require('jsonwebtoken');
var secret = '...';

exports.endpoints = function(db) {
    var endpoints = [
      {
        method: 'POST',
        path: '/login',
        config: { auth: false },
        handler: function (request, reply) {

            db.users.findOne({
                mail: request.payload.mail
            }, (err, doc) => {

                if (err) {return reply(Boom.wrap(err, 500));}

                if (!doc) {return reply(Boom.notFound("User and/or password invalid"));}

                if(encrypt.compare(doc.password, request.payload.password)){
                  delete doc.password;
                  delete doc.create_date;
                  return reply({
                    login: true,
                    token: JWT.sign(doc, secret),
                    user: doc
                  });
                }else{
                  return reply(Boom.notFound("User and/or password invalid"));
                }

            });
        },
        config: {
            validate: {
                payload: {
                    mail: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            }
        }
    }];


    return endpoints;

  };
