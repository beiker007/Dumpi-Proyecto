import Cl_vGeneral from "./tools/Cl_vGeneral.js";
/**
 * Clase Cl_vRegistro
 * Se encarga de manejar la vista del formulario de registros:
 * - Engancha los inputs y botones del DOM.
 * - Muestra los registros en la tabla.
 * - Envía los datos al controlador para que sean validados y guardados.
 */
export default class Cl_vRegistro extends Cl_vGeneral {
    /**
     * Constructor de la clase Cl_vRegistro.
     * Engancha los elementos del DOM y configura los eventos.
     */
    constructor() {
        super({ formName: "formRegistro" }); // Llama a super() primero
        // Enganchar inputs
        this.inReferencia = document.getElementById("inReferencia");
        this.inConcepto = document.getElementById("inConcepto");
        this.inCategoria = document.getElementById("inCategoria");
        this.inMonto = document.getElementById("inMonto");
        this.inFecha = document.getElementById("inFecha");
        // Botones
        this.btRegistrar = document.getElementById("btRegistrar");
        this.btCancelar = document.getElementById("btCancelar");
        // Configurar eventos de los botones
        if (this.btRegistrar) {
            this.btRegistrar.addEventListener("click", () => this.agregarRegistro());
        }
        if (this.btCancelar) {
            this.btCancelar.addEventListener("click", () => this.cancelar());
        }
        // Tbody de la tabla
        this.tbody = document.getElementById("divDatosRegistrados");
        // Evitar envío por Enter en el formulario
        let form = document.getElementById("formRegistro");
        if (form) {
            form.addEventListener("submit", (e) => e.preventDefault());
        }
    }
    /**
     * Muestra los registros guardados en la tabla.
     * Obtiene los datos desde el controlador y los inserta como filas <tr>.
     */
    mostrarDatosRegistrados() {
        var _a, _b;
        if (!this.tbody)
            return;
        this.tbody.innerHTML = "";
        let datos = (_b = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.datosRegistrados()) !== null && _b !== void 0 ? _b : [];
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
        var _a, _b, _c, _d, _e;
        let referencia = (_a = this.inReferencia) === null || _a === void 0 ? void 0 : _a.value.trim();
        let concepto = (_b = this.inConcepto) === null || _b === void 0 ? void 0 : _b.value.trim();
        let categoria = (_c = this.inCategoria) === null || _c === void 0 ? void 0 : _c.value.trim();
        let monto = Number((_d = this.inMonto) === null || _d === void 0 ? void 0 : _d.value);
        let fecha = (_e = this.inFecha) === null || _e === void 0 ? void 0 : _e.value.trim();
        // Radios para Cargo/Abono
        let tipo = "";
        let cargoRadio = document.getElementById("RegistroFormDat_cargo");
        let abonoRadio = document.getElementById("RegistroFormDat_abono");
        if (cargoRadio === null || cargoRadio === void 0 ? void 0 : cargoRadio.checked) {
            tipo = "cargo";
        }
        else if (abonoRadio === null || abonoRadio === void 0 ? void 0 : abonoRadio.checked) {
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
            callback: (error) => {
                var _a;
                if (error) {
                    alert(error);
                }
                else {
                    // Resetear formulario y refrescar tabla
                    (_a = document.getElementById("formRegistro")) === null || _a === void 0 ? void 0 : _a.reset();
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
        var _a;
        (_a = document.getElementById("formRegistro")) === null || _a === void 0 ? void 0 : _a.reset();
        this.mostrarDatosRegistrados();
        // Opcional: ocultar el formulario si quieres
        // (document.getElementById("RegistroFormDat") as HTMLElement).hidden = true;
    }
}
