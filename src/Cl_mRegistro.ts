const STORAGE_KEY = "dumpi-registros";
import Cl_mDatos, { iDatos } from "./Cl_mDatos.js";

export default class Cl_mRegistro {
  private datos: Cl_mDatos[] = [];

  constructor() {
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (guardados) {
      const lista: iDatos[] = JSON.parse(guardados);
      this.datos = lista.map(d => new Cl_mDatos(d));
    }
  }

  agregarRegistro({
    datos,
    callback,
  }: {
    datos: Cl_mDatos;
    callback: (error: string | false) => void;
  }): void {
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

  listarRegistro(): iDatos[] {
    return this.datos.map(d => d.toJSON());
  }
}
