const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    getByEmail,
    update,
    add,
};

async function query() {
    const criteria = {};
    const collection = await dbService.getCollection('user');
    try {
        const users = await collection.find(criteria).toArray();
        users.forEach(user => delete user.password);

        return users;
    } catch (err) {
        console.log('ERROR: cannot find users');
        throw err;
    }
}

async function getById(userId) {
    const collection = await dbService.getCollection('user');
    try {
        const user = await collection.findOne({ _id: ObjectId(userId) });
        delete user.password;

        return user;
    } catch (err) {
        console.log(`ERROR: cannot find user ${userId}`);
    }
}
async function getByEmail(email) {
    const collection = await dbService.getCollection('user');
    try {
        const user = await collection.findOne({ email });
        return user;
    } catch (err) {
        console.log(`ERROR: cannot find user ${email}`);
        throw err;
    }
}

async function update(user) {
    const collection = await dbService.getCollection('user');
    user._id = ObjectId(user._id);

    try {
        await collection.replaceOne({ _id: user._id }, { $set: user });
        return user;
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`);
        throw err;
    }
}

async function add(userCred) {
    const collection = await dbService.getCollection('user');
    try {
        const email = userCred.email;
        const existUser = await collection.findOne({ email: email });
        if (!existUser) {
            const user = _createUser(userCred);
            await collection.insertOne(user);
            return user;
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(`ERROR: Email already exist`);
        throw err;
    }
}

function _createUser(user) {
    const { email, password, name } = user;
    let imgUrl = `https://icotar.com/initials/${name}.png`;

    return {
        email,
        password,
        name,
        role: '',
        techs: [],
        summery: '',
        imgUrl,
        points: 0,
        knowledge: [],
        uploadedQuestions: [],
        likes: 0,
    };
}
