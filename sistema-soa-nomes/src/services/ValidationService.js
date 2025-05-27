class ValidationService {
  static validateName(name) {
    if (!name || name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    return name.trim();
  }

  static validateLocalidade(localidade) {
    if (!localidade || localidade === '') {
      throw new Error('Localidade deve ser informada');
    }
    return localidade;
  }
}

export default ValidationService;