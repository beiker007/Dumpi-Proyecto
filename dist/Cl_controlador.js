import Cl_mDatos from "./Cl_mDatos.js";
import Cl_mCategoria from "./Cl_mCategorias.js";
import Cl_mRegistro from "./Cl_mRegistro.js"; // 👈 usa tu modelo de colección
export default class Cl_controlador {
    constructor(vista) {
        this.vista = vista;
        this.vista.controlador = this;
        this.modelo = new Cl_mRegistro(); // carga desde localStorage dentro del modelo
        this.modeloCategoria = new Cl_mCategoria("");
    }
    agregarRegistro({ registroData, callback, }) {
        // construir Cl_mDatos a partir de los datos planos
        const nuevoDato = new Cl_mDatos(registroData);
        // delegar en Cl_mRegistro, que valida duplicados + guarda en localStorage
        this.modelo.agregarRegistro({
            datos: nuevoDato,
            callback,
        });
    }
    datosRegistrados() {
        // siempre pregunta al modelo, que ya está sincronizado con localStorage
        return this.modelo.listarRegistro();
    }
    /** Agregar nueva categoría */
    agregarCategoria({ categoriaData, callback, }) {
        this.modeloCategoria.agregarCategoria({
            categoria: new Cl_mCategoria(categoriaData.nombre),
            callback: (error) => {
                callback(error);
            },
        });
    }
    /** Listar categorías */
    categoriasRegistradas() {
        return this.modeloCategoria.listarCategoria();
    }
}
