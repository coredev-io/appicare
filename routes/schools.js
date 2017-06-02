'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const moment = require('moment');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: config.ver+'/schools',
        config: { auth: 'jwt' },
        handler: function (request, reply) {

            db.schools.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 500));
                }

                reply(docs).header("Authorization", request.headers.authorization);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/schools/{id}',
        handler: function (request, reply) {

            db.schools.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 500));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/schools',
        handler: function (request, reply) {

            const school = request.payload;

            //Create an id
            school._id = uuid.v1();
            user.create_date = moment().format('MMMM Do YYYY, h:mm:ss a');

            db.schools.save(school, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 500));
                }

                reply(school);
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(10).max(50).required(),
                    addres: Joi.string().min(10).max(50).required(),
                    phone: Joi.number().min(8).required(),
                    grade: Joi.string()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/schools/{id}',
        handler: function (request, reply) {

            db.schools.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 500));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(8).max(60).required(),
                    author: Joi.string().min(10).max(50).optional(),
                    isbn: Joi.number().optional()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/schools/{id}',
        handler: function (request, reply) {

            db.schools.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 500));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-schools'
};
