const argon2 = require('argon2');

(async () => {
  try {
    const hash = "$argon2id$v=19$m=65536,t=3,p=4$lG1ipFLpThPm3xHO16WNkg$lPU7EIaLm2Jk636/NuoW/6R2q/1DdndpBixUq0NSnvI";
    const senha = "Lila77777"; // Substitua pela senha fornecida no login

    const isValid = await argon2.verify(hash, senha);
    console.log('Senha válida?', isValid);
  } catch (err) {
    console.error('Erro ao verificar o hash:', err.message);
  }
})();
