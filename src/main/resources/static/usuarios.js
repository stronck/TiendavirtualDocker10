
/*
 * Autor: Camilo Tibatá Salguero
 * Proyecto: E-commerce
 * Descripción: Script.
 */

// variable usuario global de localstorage (mostrarUsu,eliminarUsu,actualizarUsu) y en productocarrito.js(funcionPagar)
let usuario = JSON.parse(localStorage.getItem('usuario'));



function mostrarUsuarioNavbar() {
    // se trae usuario de localstorage y se convierte de json a objeto de javascript, listo para usar
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const btnRegistrarse = document.getElementById('btnRegistrarse');
    const btnIniciarSesion = document.getElementById('btnIniciarSesion');
    const btnMiCuenta = document.getElementById('btnMiCuenta');
    const navbar = document.querySelector('.navbar .ms-auto');
    if (usuario) {
        // Ocultar botones de "Registrarse" e "Iniciar Sesión" si hay usuario en localstorage
        if (btnRegistrarse) btnRegistrarse.style.display = 'none';
        if (btnIniciarSesion) btnIniciarSesion.style.display = 'none';
        // Mostrar botón de "Mi Cuenta" y redirigir a la página segun su rol (admin o user)
        if (btnMiCuenta) {
            btnMiCuenta.href = usuario.rol === 'admin' ? 'admin.html' : 'user.html';
            btnMiCuenta.style.display = 'inline-block';
        }
        // Mostrar imagenCircle, nombreUsuario y botón de "Cerrar Sesión"
        navbar.innerHTML += `
            <div class="d-flex align-items-center">
                <i class="fa-solid fa-user-circle text-light fs-3 me-2"></i>
                <span class="me-3 fw-bold text-light">${usuario.nombreUsuario}</span>
                <button id="cerrarSesion" class="btn btn-success btn-sm">Cerrar Sesión</button>
            </div>
        `;
        // Cerrar Sesión: borrar la sesión local y reemplazar la entrada actual del historial.
        // Esto evita que el documento autenticado quede como la página inmediatamente anterior.
        document.getElementById('cerrarSesion').addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.replace('index.html');
        });
    } else {
        // si no hay Usuario Mostrar los botones de "Registrarse" e "Iniciar Sesión" y ocultar "Mi Cuenta"
        if (btnRegistrarse) btnRegistrarse.style.display = 'inline-block';
        if (btnIniciarSesion) btnIniciarSesion.style.display = 'inline-block';
        if (btnMiCuenta) btnMiCuenta.style.display = 'none'; // Asegurar que "Mi Cuenta" no aparezca
    }
}
mostrarUsuarioNavbar();



async function registrarUsuario() {
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const celular = document.getElementById('celular').value;
    const correo = document.getElementById('correo').value;
    const direccionEnvio = document.getElementById('direccionEnvio').value;
    if (contrasena !== confirmarContrasena) {
            alert('Las contraseñas no coinciden.');
            return;
        }
    const usuario = { nombreUsuario, contrasena, nombres, apellidos, celular, correo, direccionEnvio };

    // Recibe la respuesta del backend en json
    const response = await fetch('/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // convierte el objeto de javascript del formulario a json para q fetch lo pueda enviar a el backend
        body: JSON.stringify(usuario)
    });
    if (response.ok) {
        alert('Usuario registrado correctamente');
        window.location.href = 'iniciarsesion.html';
    } else {
        alert('Error al registrar el usuario');
    }
}
// registroForm formulario html
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', (e) => {
// evita que se recargue la pagina al dar clic en el boton de submit guardar del formulario y se ejecute la funcion registrarUsuario
        e.preventDefault();
        registrarUsuario();
    });
}


// async declara que la funcion retornara una promesa, permitiendo usar await dentro de ella para esperar la respuesta del backend sin bloquear el hilo principal de javascript
 async function iniciarSesion() {
     const nombreUsuario = document.getElementById('nombreUsuario').value;
     const contrasena = document.getElementById('contrasena').value;
         // 2. Recibe la respuesta del backend en json
         const response = await fetch('/api/usuarios/iniciar-sesion', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             // 1. convierte el objeto de javascript del formulario a json para q fetch lo pueda enviar a el backend
             body: JSON.stringify({ nombreUsuario, contrasena })
         });
         if (!response.ok) {
             alert('Credenciales incorrectas o usuario no existe en la base de datos');
             return;
         }
         // 3. convierte la respuesta json a objeto de javascript y se guarda en la constante usuario
         const usuario = await response.json();
         if (usuario && usuario.rol) {
         // 4. guarda en localstorage el usuario en json y redirige a la pagina segun su rol (admin o user)
             localStorage.setItem('usuario', JSON.stringify(usuario));
             window.location.href = usuario.rol.toLowerCase() === 'admin' ? 'admin.html' : 'user.html';
         } else {
             alert('Error al iniciar sesión: usuario sin rol');
         }
     }
// loginForm formulario html
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
// evita que se recargue la pagina al dar clic en el boton de submit guardar del formulario y se ejecute la funcion registrarUsuario
        e.preventDefault();
        iniciarSesion();
    });
}



// CARGAR USUARIOS desde bd, y si la ruta termina con admin.html
if (window.location.pathname.endsWith('admin.html')) {
    async function cargarUsuarios() {
        // Recibe la respuesta del backend en json
        const response = await fetch('/api/usuarios');
        // convierte la respuesta json a objeto de javascript y se guarda en la constante usuarios
        const usuarios = await response.json();
        const table = document.getElementById('usuariosTable');
        if (table) {
            table.innerHTML = '';
            // recorre el array de usuarios y los muestra en la tabla
            usuarios.forEach(user => {
                table.innerHTML += `
                    <tr>
                        <td>${user.nombres}</td>
                        <td>${user.apellidos}</td>
                        <td>${user.celular}</td>
                        <td>${user.rol}</td>
                    </tr>
                `;
            });
        }
    }
    cargarUsuarios();
}



// CARGAR USUARIO desde localstorage, y si la ruta termina con user.html
if (window.location.pathname.endsWith('user.html') && usuario) {
     document.getElementById('nombreUsuario').value = usuario.nombreUsuario;
     document.getElementById('nombres').value = usuario.nombres;
     document.getElementById('apellidos').value = usuario.apellidos;
     document.getElementById('celular').value = usuario.celular;
     document.getElementById('correo').value = usuario.correo;
     document.getElementById('direccionEnvio').value = usuario.direccionEnvio;
 }
// ELIMINAR cuenta de usuario de bd por id y metodo delete, y tmbn de localstorage
    const eliminarCuentaBtn = document.getElementById('eliminarCuenta');
    if (eliminarCuentaBtn) {
        eliminarCuentaBtn.addEventListener('click', async () => {
            await fetch(`/api/usuarios/${usuario.id}`, { method: 'DELETE' });
            localStorage.removeItem('usuario');
            alert('cuenta eliminada con exito');
            window.location.replace('index.html');
        });
    }



// ACTUALIZAR datos de usuario
    //  botones de actualizarDatos, guardarCambios y campos input de contraseña
    const actualizarDatosBtn = document.getElementById('actualizarDatos');
    const guardarCambiosBtn = document.getElementById('guardarCambios');
    const passwordFields = document.getElementById('passwordFields');
    // al dar click en estos 2 botones se ejecuta el siguiente codigo
    if (actualizarDatosBtn && guardarCambiosBtn) {
        actualizarDatosBtn.addEventListener('click', () => {
            // Habilitar edición de todos los campos
            document.querySelectorAll('#updateForm input').forEach(input => {
                input.disabled = false;
            });
            // Mostrar campos de contraseña
            passwordFields.style.display = 'block';
            // ocultar boton de actualizarDatos y mostrar boton de guardarCambios
            actualizarDatosBtn.style.display = 'none';
            guardarCambiosBtn.style.display = 'block';
        });
        // GUARDAR NUEVOS DATOS ACTUALIZADOS
        guardarCambiosBtn.addEventListener('click', async () => {
        // verificar los campos no pueden estar vacios
        const inputs = document.querySelectorAll('#updateForm input');
            for (const input of inputs) {
                if (!input.value && !input.disabled) {
                    alert('Todos los campos deben estar llenos.');
                    return;
                }
            }
            // validacion la nuevaContraseña debe coincidir con la confirmacion y no estar vacia
            const nuevaContrasena = document.getElementById('nuevaContrasena').value;
            const confirmarContrasena = document.getElementById('confirmarContrasena').value;
            if (nuevaContrasena && nuevaContrasena !== confirmarContrasena) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            // Actualizar usuario en bd, localstorage, formulario y recargar la pagina con los nuevos datos
            const usuarioActualizado = {
                id: usuario.id,
                nombreUsuario: document.getElementById('nombreUsuario').value,
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                celular: document.getElementById('celular').value,
                correo: document.getElementById('correo').value,
                direccionEnvio: document.getElementById('direccionEnvio').value,
                // si nuevaContraseña es verdadera entonces se guarda nuevaContraseña, si no se guarda la misma contraseña
                contrasena: nuevaContrasena ? nuevaContrasena : usuario.contrasena
            };
            // 2. Recibe la respuesta del backend en json
            const response = await fetch('/api/usuarios', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // 1. convierte el objeto de javascript del formulario actualizado a json para q fetch lo pueda enviar a el backend
                body: JSON.stringify(usuarioActualizado)
            });
            if (response.ok) {
                alert('Datos actualizados correctamente');
                // 3. guarda en localstorage el usuario actualizado en json
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
                window.location.reload();
            } else {
                alert('Error al actualizar los datos');
            }
        });
    }



    // esta funcion es para recargar la pagina cuando se vuelve a cargar desde el bfcache(disco/memoria del navegador) o desde el cache del storage del navegador)
    window.onpageshow = (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    };