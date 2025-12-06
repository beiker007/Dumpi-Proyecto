const STORAGE_KEY = "dumpi-registros";
import Cl_mDatos from "./Cl_mDatos.js";
export default class Cl_mRegistro {
    constructor() {
        this.datos = [];
        const guardados = localStorage.getItem(STORAGE_KEY);
        if (guardados) {
            const lista = JSON.parse(guardados);
            this.datos = lista.map(d => new Cl_mDatos(d));
        }
    }
    agregarRegistro({ datos, callback, }) {
        const error = datos.error();
        if (error) {
            callback(error);
            return;
        }
        const existe = this.datos.find(d => d.referencia === datos.referencia);
        if (existe) {
            callback("La referencia ya está registrada.");
            return;
        }
        this.datos.push(datos);
        // guardamos SIEMPRE con la misma clave
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.listarRegistro()));
        callback(false);
    }
    listarRegistro() {
        return this.datos.map(d => d.toJSON());
    }
}
