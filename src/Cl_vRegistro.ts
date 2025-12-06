import { iDatos } from "./Cl_mDatos.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";

/**
 * Clase Cl_vRegistro
 * Se encarga de manejar la vista del formulario de registros:
 * - Engancha los inputs y botones del DOM.
 * - Muestra los registros en la tabla.
 * - Envía los datos al controlador para que sean validados y guardados.
 */
export default class Cl_vRegistro extends Cl_vGeneral{
  // Inputs del formulario
  private inReferencia!: HTMLInputElement; // - El ! le dice al compilador: 
                                           // “Confía en mí, yo me encargaré de inicializar esta propiedad antes de usarla.
                                           //  No es null ni undefined cuando la use.”

  private inConcepto!: HTMLInputElement;
  private inMonto!: HTMLInputElement;
  private inFecha!: HTMLInputElement;
  private inCategoria!: HTMLInputElement;

  // Botones
  private btRegistrar!: HTMLButtonElement;
  private btCancelar!: HTMLButtonElement;

  // Tabla donde se muestran los registros
  private tbody!: HTMLTableSectionElement;

  // Referencia al controlador
  public _controlador: any;

  /**
   * Constructor de la clase Cl_vRegistro.
   * Engancha los elementos del DOM y configura los eventos.
   */
  constructor() {
    super({ formName: "formRegistro" })// Llama a super() primero

    // Enganchar inputs
    this.inReferencia = document.getElementById("inReferencia") as HTMLInputElement;
    this.inConcepto   = document.getElementById("inConcepto") as HTMLInputElement;
    this.inCategoria  = document.getElementById("inCategoria") as HTMLInputElement;
    this.inMonto      = document.getElementById("inMonto") as HTMLInputElement;
    this.inFecha      = document.getElementById("inFecha") as HTMLInputElement;

    // Botones
    this.btRegistrar = document.getElementById("btRegistrar") as HTMLButtonElement;
    this.btCancelar  = document.getElementById("btCancelar") as HTMLButtonElement;

    // Configurar eventos de los botones
    if (this.btRegistrar) {
      this.btRegistrar.addEventListener("click", () => this.agregarRegistro());
    }
    if (this.btCancelar) {
      this.btCancelar.addEventListener("click", () => this.cancelar());
    }

    // Tbody de la tabla
    this.tbody = document.getElementById("divDatosRegistrados") as HTMLTableSectionElement;

    // Evitar envío por Enter en el formulario
    let form = document.getElementById("formRegistro") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => e.preventDefault());
    }
  }

  /**
   * Muestra los registros guardados en la tabla.
   * Obtiene los datos desde el controlador y los inserta como filas <tr>.
   */
  mostrarDatosRegistrados() {
    if (!this.tbody) return;
    this.tbody.innerHTML = "";
    let datos: iDatos[] = this.controlador?.datosRegistrados() ?? [];

    for (let d of datos) {
      const tr = document.createElement("tr");
      tr.classList.add("card-row");
      tr.innerHTML = `
        <td data-label="Referencia">${d.referencia}</td>
        <td data-label="Concepto">${d.concepto}</td>
        <td data-label="Monto">${d.monto}</td>
        <td data-label="Fecha">${d.fecha}</td>
        <td data-label="Categoría">${d.categoria}</td>
        <td data-label="Tipo">${d.tipo}</td>
      `;
      this.tbody.appendChild(tr);
    }
  }

  /**
   * Recoge los datos del formulario y los envía al controlador.
   * Valida que todos los campos estén completos y que se haya seleccionado Cargo/Abono.
   */
  agregarRegistro() {
    let referencia = this.inReferencia?.value.trim();
    let concepto   = this.inConcepto?.value.trim();
    let categoria  = this.inCategoria?.value.trim();
    let monto      = Number(this.inMonto?.value);
    let fecha      = this.inFecha?.value.trim();

    // Radios para Cargo/Abono
    let tipo = "";
    let cargoRadio = document.getElementById("RegistroFormDat_cargo") as HTMLInputElement;
    let abonoRadio = document.getElementById("RegistroFormDat_abono") as HTMLInputElement;

    if (cargoRadio?.checked) {
      tipo = "cargo";
    } else if (abonoRadio?.checked) {
      tipo = "abono";
    }

    // Validación básica
    if (!referencia || !concepto || !categoria || isNaN(monto) || !fecha || !tipo) {
      alert("Todos los campos son obligatorios y deben ser válidos.");
      return;
    }

    // Enviar al controlador
    this._controlador.agregarRegistro({
      registroData: { referencia, concepto, categoria, monto, fecha, tipo },
      callback: (error: string | false) => {
        if (error) {
          alert(error);
        } else {
          // Resetear formulario y refrescar tabla
          (document.getElementById("formRegistro") as HTMLFormElement)?.reset();
          this.mostrarDatosRegistrados();
        }
      },
    });
  }

  /**
   * Cancela la operación actual.
   * Limpia el formulario y refresca la tabla.
   * Opcionalmente puede ocultar el formulario.
   */
  cancelar() {
    (document.getElementById("formRegistro") as HTMLFormElement)?.reset();
    this.mostrarDatosRegistrados();

    // Opcional: ocultar el formulario si quieres
    // (document.getElementById("RegistroFormDat") as HTMLElement).hidden = true;
  }
}