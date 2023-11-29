async function validarCampos(req, res, next) {
    const {
        idClient, nome, preco, idade, estado, cidade,
        genero, altura, peso, descricao, pix, dinheiro,
        cartaoCredito, cartaoDebito, anal, boquete,
        beijo, massagem, chuvaDourada
    } = req.body;

    if (
        idClient && nome && preco && idade && estado && cidade &&
        genero && altura && peso && descricao && pix && dinheiro &&
        cartaoCredito && cartaoDebito && anal && boquete &&
        beijo && massagem && chuvaDourada
    ) {
        next();
    } else {
        res.status(400).json({ error: 'Campos incompletos na requisição' });
    }
}

module.exports = { validarCampos };