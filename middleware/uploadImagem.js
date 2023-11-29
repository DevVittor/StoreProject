const Jimp = require('jimp');
const sharp = require('sharp');
const fs = require('fs');
const removeAccents = require('remove-accents');

async function processarImagem(req, res, next) {
    if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo foi enviado" });
        return;
    }

    const imgName = req.file.filename;
    //Inicio do Jimp
    const imagem = await Jimp.read(`upload/${imgName}`);
    const marcaDagua = await Jimp.read(`public/marca.png`);
    marcaDagua.opacity(1); // Ajuste a opacidade conforme necessário
    marcaDagua.resize(256, 256);
    // Obter as dimensões da imagem principal e da marca d'água
    const imagemWidth = imagem.bitmap.width;
    const imagemHeight = imagem.bitmap.height;
    const marcaWidth = marcaDagua.bitmap.width;
    const marcaHeight = marcaDagua.bitmap.height;

    // Definir as coordenadas para o canto inferior direito
    const coordenadaX = imagemWidth - marcaWidth - 10; // Ajuste os valores de margem conforme desejado
    const coordenadaY = imagemHeight - marcaHeight - 10; // Ajuste os valores de margem conforme desejado

    imagem.composite(marcaDagua, coordenadaX, coordenadaY, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });
    await imagem.writeAsync(`upload/${imgName}`);
    //Fim do Jimp
    // Remove acentos e mantém apenas caracteres alfanuméricos no nome
    //const nomeArquivo = removeAccents(nomeReq).replace(/[^a-zA-Z0-9]+/g, '_');
    const nomeSemAcentos = removeAccents(req.body.nome);
    const nomeArquivo = nomeSemAcentos.replace(/[^a-zA-Z0-9]+/g, '_');
    // Adiciona um carimbo de data e a extensão .webp ao nome do arquivo
    const convertedImgName = `${nomeArquivo}_${Date.now()}.webp`;
    await sharp(`upload/${imgName}`).resize({ width: 600, fit: 'cover', position: 'center' }).toFile(`upload/${convertedImgName}`);
    fs.unlinkSync(`upload/${imgName}`);
    const localImg = convertedImgName;
    req.localImg = localImg; // Passar o local da imagem para a próxima etapa
    next();
}

module.exports = { processarImagem };