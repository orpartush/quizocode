const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const { info } = require('../../services/logger.service');

module.exports = {
    query,
    getById,
    getByCategory,
    remove,
    update,
    add,
    getQuestionById,
};

async function query() {
    const collection = await dbService.getCollection('quiz');
    try {
        const quizzes = await collection.find({}).toArray();
        return quizzes;
    } catch (err) {
        info('ERROR: cannot find quizes');
        throw err;
    }
}

async function getById(id) {
    const collection = await dbService.getCollection('quiz');
    try {
        const quiz = await collection.findOne({ _id: ObjectId(id) });
        return quiz;
    } catch (err) {
        info(`ERROR: while finding quiz ${id}`);
        throw err;
    }
}

async function getQuestionById(id) {
    const collection = await dbService.getCollection('quiz');
    try {
        const quizzes = await collection.find({}).toArray();
        for (const quiz of quizzes) {
            let question = quiz.questions.find(question => question.id === id);
            if (question) return question;
        }
    } catch (err) {
        info(`Error: while finding question by id: ${id}`);
    }
}

async function getByCategory(quizCategory) {
    const { category } = quizCategory;
    const collection = await dbService.getCollection('quiz');
    try {
        const quiz = await collection.findOne({
            category: category.charAt(0).toUpperCase() + category.substring(1),
        });
        return quiz;
    } catch (err) {
        info(`ERROR: while finding quiz by category ${category}`);
        throw err;
    }
}

async function remove(quizId) {
    const collection = await dbService.getCollection('quiz');
    try {
        await collection.deleteOne({ _id: ObjectId(quizId) });
    } catch (err) {
        Info(`ERROR: cannot remove quiz ${quizId}`);
        throw err;
    }
}

async function update(newQuestion) {
    const collection = await dbService.getCollection('quiz');
    const quiz = await collection.findOne({ category: newQuestion.category });
    quiz.questions.push(newQuestion);
    try {
        await collection.replaceOne({ _id: quiz._id }, { $set: quiz });
        return quiz;
    } catch (err) {
        info(`ERROR: cannot update quiz ${quiz._id}`);
        throw err;
    }
}

async function add(quiz) {
    const collection = await dbService.getCollection('quiz');
    try {
        await collection.insertOne(quiz);
        return quiz;
    } catch (err) {
        info(`ERROR: cannot insert quiz`);
        throw err;
    }
}
