import Cl_mDatos, { iDatos } from "./Cl_mDatos.js";
import Cl_vRegistro from "./Cl_vRegistro.js";
import Cl_mCategoria, { iCategoria } from "./Cl_mCategorias.js";
import Cl_mRegistro from "./Cl_mRegistro.js";   // 👈 usa tu modelo de colección

export default class Cl_controlador {
  private modelo: Cl_mRegistro;    // en vez de array suelto
  private modeloCategoria: Cl_mCategoria;
  public vista: Cl_vRegistro;
  constructor(vista: Cl_vRegistro) {
    this.vista = vista;
    this.vista.controlador = this;
    this.modelo = new Cl_mRegistro();   // carga desde localStorage dentro del modelo
    this.modeloCategoria = new Cl_mCategoria("");
  }

  agregarRegistro({
    registroData,
    callback,
  }: {
    registroData: iDatos;
    callback: (error: string | false) => void;
  }): void {
    // construir Cl_mDatos a partir de los datos planos
    const nuevoDato = new Cl_mDatos(registroData);

    // delegar en Cl_mRegistro, que valida duplicados + guarda en localStorage
    this.modelo.agregarRegistro({
      datos: nuevoDato,
      callback,
    });
  }

  datosRegistrados(): iDatos[] {
    // siempre pregunta al modelo, que ya está sincronizado con localStorage
    return this.modelo.listarRegistro();
  }

  /** Agregar nueva categoría */
  agregarCategoria({
    categoriaData,
    callback,
  }: {
    categoriaData: iCategoria;
    callback: (error: string | false) => void;
  }): void {
    this.modeloCategoria.agregarCategoria({
      categoria: new Cl_mCategoria(categoriaData.nombre),
      callback: (error: string | false) => {
        callback(error);
      },
    });
  }

  /** Listar categorías */
  categoriasRegistradas(): iCategoria[] {
    return this.modeloCategoria.listarCategoria();
  }
}