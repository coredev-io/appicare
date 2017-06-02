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
          path: '/users',
          // config: { auth: 'jwt' },
          handler: function (request, reply) {

              db.users.find({
              }, (err, doc) => {
                  if (err) {return reply(Boom.wrap(err, 500));}
                  if (!doc) {return reply(Boom.notFound());}
                  reply(doc);
              });

          }
      },


    {
        method: 'GET',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.findOne({
                _id: request.params.id
            }, (err, doc) => {
                if (err) {return reply(Boom.wrap(err, 500));}
                if (!doc) {return reply(Boom.notFound());}
                reply(doc);
            });

        }
    },

    {
        method: 'POST',
        path: '/users',
        handler: function (request, reply) {

            console.log(request);

            const user = request.payload;

            //Create an id
            user._id = uuid.v1();
            delete user.password_confirmation;
            user.create_date = moment().format('MMMM Do YYYY, h:mm:ss a');

            //PASS ENCRYPT
            user.password = encrypt.generate(user.password);

            db.schools.findOne({
                _id: request.payload.id_school
            }, (err, doc) => {

                if (err) {return reply(Boom.wrap(err, 500));}
                if (!doc) {return reply(Boom.badRequest("School ID does not exist"));}

                db.users.findOne({
                    mail: request.payload.mail
                }, (err, doc) => {

                    if (err) {return reply(Boom.wrap(err, 500));}
                    if (doc) {return reply(Boom.badRequest('User exists'));}

                    db.users.save(user, (err, result) => {
                        if (err) {return reply(Boom.wrap(err, 500));}
                        delete user.password;
                        reply(user);
                    });
                });
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(8).max(50).required(),
                    mail: Joi.string().email().required(),
                    profile: Joi.string().min(3).max(50).required(),
                    id_school: Joi.string().required(),
                    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).required(),
                    password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
                }
            }
        }
    },

    {
        method: 'PATCH',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {return reply(Boom.wrap(err, 500));}
                if (result.n === 0) {return reply(Boom.notFound());}
                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                  name: Joi.string().min(8).max(50),
                  mail: Joi.string().email(),
                  profile: Joi.string().min(3).max(50),
                  id_school: Joi.string(),
                  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
                  password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
                }).required().min(1)
            }
        }
    },

    {
        method: 'DELETE',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {return reply(Boom.wrap(err, 500));}
                if (result.n === 0) {return reply(Boom.notFound());}
                reply().code(204);
            });
        }
    }];

    return endpoints;
};
