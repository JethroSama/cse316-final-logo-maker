var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo');
var UserModel = require('../models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const logo = logoIds => {
    return LogoModel.find({ _id: { $in: logoIds } })
    .then(logos => {
        return logos.map(logo => {
            return {
                _id: logo._id,
                height: logo.height,
                width: logo.width,
                text: logo.text,
                backgroundColor: logo.backgroundColor,
                borderColor: logo.borderColor,
                borderRadius: logo.borderRadius,
                borderWidth: logo.borderWidth,
                images: logo.images,
                padding: logo.padding, 
                margin: logo.margin,
                lastUpdate: logo.lastUpdate,
                created_by: user.bind(this, logo.created_by)
            }
        });
    })
    .catch(err => {
        throw err;
    });
}

const user = userId => {
    return UserModel.findById(userId)
    .then(user => {
        return {
            _id: user.id,
            username: user.username,
            password: user.password, 
            createdLogos: logo.bind(this, user.created_by)
        };
    })
    .catch(err => {
        throw err;
    });
}

var logoTextType = new GraphQLObjectType({
    name: 'logotext',
    fields: function() {
        return {
            posX: { type: GraphQLInt },
            posY: { type: GraphQLInt },
            textString: { type: GraphQLString },
            textFontSize: { type: GraphQLInt },
            textColor: { type: GraphQLString }
        }
    }
});

var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            height: {
                type: GraphQLInt
            },
            width: {
                type: GraphQLInt
            },
            text: {
                type: GraphQLList(logoTextType)
            },
            backgroundColor : {
                type: GraphQLString
            },
            borderColor : {
                type: GraphQLString
            },
            borderRadius: {
                type: GraphQLInt
            },
            borderWidth: {
                type: GraphQLInt
            },
            images: {
                type: GraphQLList(GraphQLString)
            },
            padding: {
                type: GraphQLInt
            },
            margin: {
                type: GraphQLInt
            },
            created_by:{ //every logo should have a user
                type: userType
            },
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
});

var userType = new GraphQLObjectType({
    name: 'user',
    fields: function() {
        return{
            _id: {
                type: GraphQLString
            },
            username: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },
            createdLogos: {
                type: GraphQLList(logoType)
            }
        }
    }
});

var authData = new GraphQLObjectType({
    name: 'auth',
    fields: function(){
        return{
            _id: {
                type: GraphQLString
            },
            token: {
                type: GraphQLString
            },
            tokenExpiration: {
                type: GraphQLInt
            }
        };
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            getAllLogos: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    return LogoModel.find()
                    .then(events => {
                        return events.map(event => {
                            return {
                                _id: event._id,
                                height: event.height,
                                width: event.width,
                                text: event.text,
                                backgroundColor: event.backgroundColor,
                                borderColor: event.borderColor,
                                borderRadius: event.borderRadius,
                                borderWidth: event.borderWidth,
                                images: event.images,
                                padding: event.padding, 
                                margin: event.margin,
                                lastUpdate: event.lastUpdate,
                                created_by: user.bind(this, event.created_by)
                            };
                        });
                    })
                    .catch(err =>{
                        throw err;
                    });
                    // const logos = LogoModel.find().exec() (alternate way)
                    // if (!logos) {
                    //     throw new Error('Error')
                    // }
                    // return logos
                }
            },
            getAllUsers: {
                type: new GraphQLList(userType),
                resolve: function(){
                    return UserModel.find()
                    .then(users => {
                        return users.map(user => {
                            return {
                                _id: user.id,
                                username: user.username,
                                password: user.password,
                                createdLogos: logo.bind(this, user.createdLogos)
                            };
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
                    // const users = UserModel.find().exec()
                    // if(!users) {
                    //     throw new Error('Error Users')
                    // }
                    // return users
                }
            },
            getLogo: {
                type: logoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    return LogoModel.findById(params.id)
                    .then(alogo => {
                        return {
                            _id: alogo._id,
                            height: alogo.height,
                            width: alogo.width,
                            text: alogo.text,
                            backgroundColor: alogo.backgroundColor,
                            borderColor: alogo.borderColor,
                            borderRadius: alogo.borderRadius,
                            borderWidth: alogo.borderWidth,
                            images: alogo.images,
                            padding: alogo.padding,
                            margin: alogo.margin,
                            lastUpdate: alogo.lastUpdate,
                            created_by: user.bind(this, alogo.created_by)
                        };
                    })
                    .catch(err => {
                        throw err;
                    });
                    // const logoDetails = LogoModel.findById(params.id).exec()
                    // if (!logoDetails) {
                    //     throw new Error('Error')
                    // }
                    // return logoDetails
                }
            },
            getUser: {
                type: userType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){
                    return UserModel.findById(params.id)
                    .then(user => {
                        return {
                            _id: user.id,
                            username: user.username,
                            password: user.password,
                            createdLogos: logo.bind(this, user.createdLogos)
                        };
                    })
                    .catch(err => {
                        throw err;
                    });
                    // const userDetails = UserModel.findById(params.id).exec()
                    // if(!userDetails) {
                    //     throw new Error('Error user')
                    // }
                    // return userDetails
                }
            },
            login: {
                type: authData,
                args: {
                    username: {
                        name: 'username',
                        type: GraphQLString
                    },
                    password: {
                        name: 'password',
                        type: GraphQLString
                    }
                },
                resolve: async function(root, params){
                    const user = await UserModel.findOne({ username: params.username });
                    if(!user){
                        throw new Error('User does not exist');
                    }
                    const validPass = await bcrypt.compare(params.password, user.password);
                    if(!validPass){
                        throw new Error('Incorrect password');
                    }
                    const token = jwt.sign({ userId: user.id, username: user.username }, 'mernsecure', {
                        expiresIn: '1h'
                    });
                    return { _id: user.id, token: token, tokenExpiration: 1 };
                }
            }
        }
    }
});

const logoTextInputType = new GraphQLInputObjectType({
    name: 'logoTextInput',
    fields: () => ({
        posX: {type: GraphQLInt},
        posY: {type: GraphQLInt},
        textString: {type: GraphQLString},
        textFontSize: {type: GraphQLInt},
        textColor: {type: GraphQLString}
    })
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addLogo: {
                type: logoType,
                args: {
                    height: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    width: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    text: {
                        type: new GraphQLNonNull( GraphQLList(logoTextInputType) )
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    images: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    },
                    padding : {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params, req) {
                    // check if authenticated
                    if(!req.isAuth){
                        throw new Error('Not Authenticated!');
                    }
                    console.log('before save');
                    const logo = new LogoModel({
                        height: params.height,
                        width: params.width,
                        text: params.text,
                        backgroundColor: params.backgroundColor,
                        borderColor: params.borderColor,
                        borderRadius: params.borderRadius,
                        borderWidth: params.borderWidth,
                        images: params.images,
                        padding: params.padding,
                        margin: params.margin,
                        lastUpdate: params.lastUpdate,
                        created_by: req.userId
                    });
                    let createdLogo;
                    return logo.save()
                    .then(result => {
                        console.log('after save');
                        createdLogo = { _id: result.id, height: result.height, width: result.width, text: result.text, 
                        backgroundColor: result.backgroundColor, borderColor: result.borderColor,
                        borderRadius: result.borderRadius, borderWidth: result.borderWidth, images: result.images,
                        padding: result.padding, margin: result.margin, lastUpdate: result.lastUpdate,
                        created_by: user.bind(this, result.created_by) };
                        return UserModel.findById(req.userId)
                    })
                    .then(user => {
                        if(!user){
                            throw new Error('User does not exist.');
                        }
                        user.createdLogos.push(logo);
                        return user.save();
                    })
                    .then(result => {
                        return createdLogo;
                    })
                    .catch(err => {
                        console.log(err + " hi");
                        throw err;
                    });
                    // const logoModel = new LogoModel(params); (alternate way)
                    // const newLogo = logoModel.save();
                    // UserModel.findById('5eb215daeb6fcb4784093d3f', (err, user) => {
                    //     if(err){
                    //         console.log(err);
                    //     }
                    //     if(!user){
                    //         throw new Error('User does not exist');
                    //     }
                    //     user.createdLogos.push(newLogo);
                    //     user.save();
                    // })
                    // if (!newLogo) {
                    //     throw new Error('Error');
                    // }
                    // return newLogo
                }
            },
            addUser: { // when creating a user, must need a username and password
                type: userType,
                args:{
                    username: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(root, params) {
                    return UserModel.findOne({username: params.username}).
                    then(user => {
                        if(user){
                            throw new Error('User already exists!');
                        }
                        return bcrypt.hash(params.password, 10);
                    })
                    .then(hash => {
                        const user = new UserModel({
                            username: params.username,
                            password: hash
                        });
                        return user.save();
                    })
                    .then(result => {
                        return { _id: result.id, username: result.username, password: result.password, createdLogos: result.createdLogos};
                    })
                    .catch(err => {
                        throw err;
                    });
                
            }
        },
            updateLogo: {
                type: logoType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    height: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    width: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    text: {
                        type: new GraphQLNonNull(GraphQLList(logoTextInputType))
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    images: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    },
                    padding : {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params, req) {
                    //first check if authenticated in order to make changes
                    if(!req.isAuth){
                        throw new Error('Not Authenticated')
                    }
                    return LogoModel.findByIdAndUpdate(params.id, {
                        height: params.height,
                        width: params.width,
                        text: params.text,
                        backgroundColor: params.backgroundColor,
                        borderColor: params.borderColor,
                        borderRadius: params.borderRadius,
                        borderWidth: params.borderWidth,
                        images: params.images,
                        padding: params.padding,
                        margin: params.margin,
                        lastUpdate: new Date()}, function (err) {
                        console.log(err + " hiiiii");
                        if (err) return next(err)
                    });
                }
            },
            removeLogo: {
                type: logoType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remLogo = LogoModel.findByIdAndRemove(params.id).exec();
                    if (!remLogo) {
                        throw new Error('Error')
                    }
                    return remLogo;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });