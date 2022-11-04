import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { ExcelService } from '../../services/export-excel.service';
import { FiltrarTablaService } from '../../services/filtrar-tabla.service';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(public aut: AuthService,
    private FiltrarTabla: FiltrarTablaService,
    private excelService: ExcelService) { }

  fecha = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  mesActual: any = new Date().getMonth();
  reporteMesActual: any;
  filterpost:string='';
  reporte=0;
  ngOnInit(): void {
    this.obtenerReporteMesActual(this.mesActual);
  }
  reporteMes(): void {
    Swal.showLoading();
    this.aut.getAsistenciaPorMes(Number(this.mesActual) + 1).subscribe((res: []) => {
      if (res.length == 0) {
        return Swal.fire({ icon: 'warning', text: 'No se encontró registros del mes seleccionado!' })
      }
      Swal.close();
      this.excelService.exportAsExcelFile(res, 'reporte total');
    }, error => {
      Swal.close();
    }
    )
  }
  exportToExcel(): void {
    Swal.showLoading();
    this.aut.getAsistenciaPorMes(Number(this.mesActual) + 1).subscribe((res: []) => {
      Swal.close();
      if (res.length == 0) {
        if (res.length == 0) {
          return Swal.fire({ icon: 'warning', text: 'No se encontró registros del mes seleccionado!' })
        }}
      else {
        var reporte = this.FiltrarTabla.filtrarHorasEmpleado(res);
        this.excelService.exportAsExcelFile(reporte, 'consolidado diario');
      }}, err => { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); })
  }

  obtenerReporteMesActual(mes: any): void {
    Swal.showLoading();
    this.aut.getAsistenciaPorMes(Number(mes) + 1).subscribe((res: []) => {
      Swal.close();
      this.reporteMesActual = this.FiltrarTabla.filtrarHorasEmpleado(res);
    }, err => { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); })
  }

  reporteMesSelect() {
    this.obtenerReporteMesActual(this.mesActual);
  }
}
