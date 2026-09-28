/*
 * errors.js · erro HTTP de domínio e validação com zod.
 */
class HttpError extends Error {
    /* Cria o erro com status e mensagem para o cliente. */
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

/* Valida com o schema zod ou lança 400 com a primeira mensagem. */
function parse(schema, data) {
    const result = schema.safeParse(data ?? {})
    if (!result.success) {
        const issue = result.error.issues[0]
        throw new HttpError(400, `${issue.path.join('.') || 'corpo'}: ${issue.message}`)
    }
    return result.data
}

/* Converte violações do SQLite em 409/422 com mensagem legível. */
function fromSqlite(error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return new HttpError(409, 'Registro duplicado: ' + error.message.split(': ').pop())
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') return new HttpError(422, 'Referência inexistente ou registro em uso.')
    if (error.code === 'SQLITE_CONSTRAINT_CHECK') return new HttpError(422, 'Valor fora das regras do cadastro.')
    return error
}

module.exports = { HttpError, parse, fromSqlite }
/* fim de errors.js */
