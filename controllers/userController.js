const Model = require("../models");
const User = Model.User;
const { checkPassword } = require("../helpers/bcrypt.js");
const { generateToken } = require("../helpers/jwt.js");


class UserController {

    static register (req, res, next) {

        let values = {
            email : req.body.email,
            password : req.body.password
        }

        User
            .create(values)
            .then(data => {
                res.status(201).json({
                    id : data.id,
                    email : data.email,
                    password : data.password
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static login (req, res, next) {
        
        let values = {
            email : req.body.email,
            password : req.body.password
        }

        let options = {
            where : { 
                email : req.body.email 
            }
        }

        User
            .findOne(options)
            .then(data => {
                if (data) {
                    let compare = checkPassword(values.password, data.password);

                    if (compare) {
                        let token = generateToken({
                            id : data.id,
                            email : data.email
                        })

                        res.status(200).json({
                            token
                        })
                    } else {
                        throw {
                            message : "Please insert correct password!"
                        }
                    }

                } else {
                    throw {
                        message : "Please insert correct email!"
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = UserController;