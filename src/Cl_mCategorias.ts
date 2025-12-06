export interface iCategoria {
  nombre: string;
}

export default class Cl_mCategoria {
  private _nombre: string = "";
  private arrCategoria: Cl_mCategoria[] = [];

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  // Mantienes tu set original
  set nombre(nombre: string) {
    this._nombre = nombre.toLocaleLowerCase().trim();
  }

  get nombre(): string {
    return this._nombre;
  }

  get ValidarNombre(): boolean {
    return this._nombre.length > 0;
  }

  get ValidarCategoria(): string | true {
    if (!this.ValidarNombre) return "Nombre";
    return true;
  }

  agregarCategoria({
    categoria,
    callback,
  }: {
    categoria: Cl_mCategoria;
    callback: (error: string | false) => void;
  }): void {
    let error = categoria.ValidarCategoria;
    if (!error) {
      callback(error);
      return;
    }

    // Normalizar para comparar
    let nombreNormalizado = this.formatearCategoria(categoria.nombre);

    let existe = this.arrCategoria.find(
      (c) => this.formatearCategoria(c.nombre) === nombreNormalizado
    );

    if (existe) {
      callback("La categoría ya existe.");
      return;
    }

    // Guardar siempre en plural y con primera letra mayúscula
    categoria._nombre = nombreNormalizado;

    this.arrCategoria.push(categoria);
    localStorage.setItem("categoria", JSON.stringify(this.listarCategoria()));
    callback(false);
  }

  listarCategoria(): iCategoria[] {
    let lista: iCategoria[] = [];
    this.arrCategoria.forEach((categoria) => {
      lista.push(categoria.toJSON());
    });
    return lista;
  }

  deleteCategoria({
    nombre,
    callback,
  }: {
    nombre: string;
    callback: (error: string | false) => void;
  }): void {
    const nombreNormalizado = this.formatearCategoria(nombre);

    let indice = this.arrCategoria.findIndex(
      (c) => this.formatearCategoria(c.nombre) === nombreNormalizado
    );

    if (indice < 0) {
      callback(`La categoría "${nombre}" no existe.`);
      return;
    }

    this.arrCategoria.splice(indice, 1);
    localStorage.setItem("categoria", JSON.stringify(this.listarCategoria()));
    callback(false);
  }

  toJSON(): iCategoria {
    return {
      nombre: this.formatearCategoria(this.nombre),
    };
  }

  /** 🔎 Normalizar: plural + primera letra mayúscula */
  /** Convierte el texto a plural y capitaliza la primera letra */
  private formatearCategoria(nombre: string): string {
    let n = nombre; // ya está en minúsculas y sin espacios gracias al set

    // Quitar acentos
    n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Asegurar plural (terminar en "s")
    if (!n.endsWith("s")) {
      n = n + "s";
    }

    // Capitalizar primera letra
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
}