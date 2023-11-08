function auth(req, res, next) {
    const authToken = req.headers["authorization"];
    if (authToken != undefined) {
        const BearerToken = authToken.split(" ");
        const token = BearerToken[1];
        console.log("Token extraído:", token);
        jwt.verify(token, keyPrivate, (error, data) => {
            if (error) {
                res.status(401).json({
                    error: `Token está Inválido! devido ao error: ${error}`,
                });
            } else {
                req.token = token;
                req.useId = { id: data.id, email: data.email };
                //res.status(200).json({ infoData: data });
                next();
            }
        });
    } else {
        res.status(401).json({ error: "Token Inválido" });
    }
}
module.exports = auth;