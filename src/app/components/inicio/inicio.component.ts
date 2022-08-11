import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AutenticacionInicioSesionService } from 'src/app/services/autenticacion-inicio-sesion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  //formularioIngreso?:any;
  userData: any;
  formularioIngreso: any;

  constructor(
    private autenticacionInicioSesion: AutenticacionInicioSesionService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  verificarCredenciales(nombreUsuario: string, contrasena: string) {
    if (nombreUsuario !== '' && contrasena !== '') {
      if (nombreUsuario.includes('.')) {
        this.autenticacionInicioSesion
          .obtenerUsuarioPorNombreUsuario(nombreUsuario)
          .subscribe((usuario1) => {
            if (usuario1 == null) {
              Swal.fire({
              icon: 'error',
              title: '¡Lo sentimos!',
              text: 'Usuario no registrado, favor contactar al superadmin para su registro.',
              });
            }
              if (usuario1.contrasena === contrasena) {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Bienvenido ' + usuario1.nombre,
                  showConfirmButton: false,
                  timer: 1500
                })
                this.router.navigate(['coach-dashboard']);
                localStorage.setItem("usuario",JSON.stringify({id:usuario1.id, nombre: usuario1.nombre}))
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '¡Lo sentimos!',
                  text: 'El nombre de usuario o la contraseña no es válida.',
                })
              }
          });
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Lo sentimos!',
          text: 'El nombre de usuario o la contraseña no es válida.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Lo sentimos!',
        text: 'El usuario y la contraseña no pueden estar vacíos, intenta de nuevo',
      });
    }
  }

  recuperarContrasena(nombreUsuario: string) {
    if (nombreUsuario !== '') {
      this.autenticacionInicioSesion
        .obtenerUsuarioPorNombreUsuario(nombreUsuario)
        .subscribe((usuario) => {
          console.log(usuario);
          this.autenticacionInicioSesion
            .getSendEmail(usuario.id)
            .subscribe((email) =>
              Swal.fire({
                position: 'center',
                icon: 'success',
                title:
                  'Una nueva contraseña ha sido generada y enviada al correo registrado',
                showConfirmButton: true,
              })
            );
        });
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'No ingresaste un usuario para recuperar la contraseña',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}
