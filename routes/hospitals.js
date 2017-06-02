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
          path: config.ver+'hospitals/all',
        //   config: { auth: 'jwt' },
          handler: function (request, reply) {

              db.hospitals.find({
              }, (err, doc) => {
                  if (err) {return reply(Boom.wrap(err, 500));}
                  if (!doc) {return reply(Boom.notFound());}
                  reply(doc);
              });

          }
      },


    {
        method: 'GET',
        path: config.ver+'hospitals/{id}',
        //   config: { auth: 'jwt' },
        handler: function (request, reply) {

            db.hospitals.findOne({
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
        path: config.ver+'hospitals/new',
        handler: function (request, reply) {
            const hospital = request.payload;

            //Create an id
            hospital._id = uuid.v1();
            hospital.create_date = moment().format('MMMM Do YYYY, h:mm:ss a');

                db.hospitals.findOne({
                    phone: request.payload.phone
                }, (err, doc) => {

                    if (err) {return reply(Boom.wrap(err, 500));}
                    if (doc) {return reply(Boom.badRequest("Hospital exists"));}

                    db.hospitals.save(hospital, (err, result) => {
                        if (err) {return reply(Boom.wrap(err, 500));}
                        var response = {
                                hospital: hospital.name,
                                message: "The hospital has been added"
                        }
                        reply(response);
                    });
                });

        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(8).max(50).required(),
                    address: Joi.string().max(100).required(),
                    phone: Joi.string().min(8).max(10)
                }
            }
        }
    },

    {
        method: 'PATCH',
        path: config.ver+'hospitals/{id}',
        //   config: { auth: 'jwt' },
        handler: function (request, reply) {

            db.hospitals.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {return reply(Boom.wrap(err, 500));}
                if (result.n === 0) {return reply(Boom.notFound());}
                var response = {
                        hospital: request.payload.name,
                        message: "The hospital has been updated"
                }
                reply(response);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                        name: Joi.string().min(8).max(50).required(),
                        address: Joi.string().max(100).required(),
                        phone: Joi.string().min(8).max(10)
                }).required().min(1)
            }
        }
    },

    {
        method: 'DELETE',
        path: config.ver+'hospitals/{id}',
        //   config: { auth: 'jwt' },
        handler: function (request, reply) {

            db.hospitals.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {return reply(Boom.wrap(err, 500));}
                if (result.n === 0) {return reply(Boom.notFound());}
                var response = {
                        hospital: request.payload.name,
                        message: "The hospital has been deleted"
                }
                reply(response);
            });
        }
    }];

    return endpoints;
};
