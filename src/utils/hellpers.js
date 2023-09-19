const errorFormatter = (res, { statusCode, message } = { statusCode: 404 , message: 'No found' }) => {
    res.status(statusCode || 404);
    res.send({ errorDetail: message  })
}
const successFormatter = (res, { statusCode, message } = { statusCode: 200 , message: 'Success!' }) => {
    res.status(statusCode || 200)
    res.send({ data: message })
}

module.exports = { errorFormatter, successFormatter };