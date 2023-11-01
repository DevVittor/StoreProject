const mongoose = require("mongoose");

const LocalEncontroSchema = new mongoose.Schema({
    estado: String,
    cidade: String,
    rua: String,
    bairro: String,
    cep: String,
});

const AtendoEm = new mongoose.Schema({
    domicilio: Boolean,
    clubeSwing: Boolean,
    meuLocal: Boolean,
    motel: Boolean,
    despedidaSolteiro: Boolean,
    hotel: Boolean,
    viagens: Boolean,
    jantarRomantico: Boolean,
    festas: Boolean,
    eventos: Boolean
});

const HorariosAtendimentoSchema = new mongoose.Schema({
    segundaFeira: [String],
    tercaFeira: [String],
    quartaFeira: [String],
    quintaFeira: [String],
    sextaFeira: [String],
    sabado: [String],
    domingo: [String],
    feriados: [String],
});

const ViagensSchema = new mongoose.Schema({
    nacionais: Boolean,
    internacionais: Boolean
});

const CorpoSchema = new mongoose.Schema({
    genero: String,
    operado: Boolean,
    altura: Number,
    peso: Number,
    numeroPés: Number,
    tatuagem: Boolean,
    piercing: Boolean,
    oculos: Boolean,
    aparelhoBocal: Boolean,
    estiloCorpo: String,
    bunda: String,
    peito: String,
    silicone: [String],
    corCabelo: String,
    estiloCabelo: String,
    corOlhos: String,
    etnia: String
});

const PelosSchema = new mongoose.Schema({
    anus: Boolean,
    pubis: Boolean,
    axila: Boolean,
    pernas: Boolean,
    bracos: Boolean,
    monancelhas: Boolean,
    peito: Boolean
});

const FormasPagamentoSchema = new mongoose.Schema({
    pix: Boolean,
    dinheiro: Boolean,
    cartaoCredito: Boolean,
    cartaoDebito: Boolean,
    transferenciaBancaria: Boolean
});

const ValidadeVantagemSchema = new mongoose.Schema({
    validadeDestaque: Date,
    validadeVerificada: Date,
    validadeProfissional: Date
});

const VantagensSchema = new mongoose.Schema({
    destaque: Boolean,
    verificada: Boolean,
    profissional: Boolean
});

const SocialMediaSchema = new mongoose.Schema({
    facebook: String,
    instagram: String,
    twitter: String,
    telegram: String,
    onlyfans: String,
    Privacy: String
});

const TiposServicoSchema = new mongoose.Schema({
    servicos: [String],
    especiais: [String]
});

const PrecoAtendimentoSchema = new mongoose.Schema({
    umaHora: Number,
    duasHoras: Number,
    tresHoras: Number,
    seisHoras: Number,
    pernoite: Number,
    finalSemana: Number
});

const TipoContaSchema = new mongoose.Schema({
    cliente: Boolean,
    acompanhante: Boolean,
    administrador: Boolean
});

const EnderecoSchema = new mongoose.Schema({
    país: String,
    estado: String,
    cidade: String,
    rua: String,
    bairro: String,
    cep: String
});

const FotoVideoSchema = new mongoose.Schema({
    fotos: [String],
    video: [String]
});

const Usuario = mongoose.model("usuarios", {
    nome: String,
    sobrenome: String,
    email: String,
    dataNascimento: Date,
    celular: String,
    whatsapp: String,
    dataConta: Date,
    galeria: FotoVideoSchema,
    endereco: EnderecoSchema,
    tipoConta: TipoContaSchema,
    preco: PrecoAtendimentoSchema,
    listaServicos: TiposServicoSchema,
    redeSociais: SocialMediaSchema,
    vantagens: VantagensSchema,
    validadeVantagem: ValidadeVantagemSchema,
    corpo: CorpoSchema,
    pelos: PelosSchema,
    descricao: String,
    formasPagamento: FormasPagamentoSchema,
    viagens: ViagensSchema,
    gravarVideo: Boolean,
    tirarFoto: Boolean,
    horariosAtendimento: HorariosAtendimentoSchema,
    locaisAtendo: AtendoEm,
    localEncontro: LocalEncontroSchema
});

module.exports = Usuario;