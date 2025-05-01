#  Breakout

Este es un juego clásico de Breakout, implementado en JavaScript con HTML5 Canvas. Fue desarrollado como parte de una práctica individual del módulo de videojuegos.

## Cómo correr el juego

1. Abre el archivo `breakout.html` ubicado en la carpeta `/html/` con cualquier navegador moderno (Chrome, Firefox, Edge, etc.).
2. El juego se iniciará automáticamente al abrir la página.
3. Presiona la **barra espaciadora** para lanzar la pelota.

> ⚠ Es importante mantener la estructura de carpetas para que los scripts y estilos se carguen correctamente desde el archivo HTML.


## Objetivo del juego

El objetivo es destruir todos los bloques de colores usando una pelota, sin dejar que esta caiga fuera de la pantalla.  
Tienes **3 vidas** para lograrlo.

---

## Controles del juego

| Acción                  | Tecla               |
|-------------------------|---------------------|
| Mover paleta a la izquierda | ⬅️ Flecha izquierda      |
| Mover paleta a la derecha  | ➡️ Flecha derecha       |
| Lanzar la pelota         | Barra espaciadora   |

---

## Reglas

- La pelota rebota en las paredes laterales y superiores, así como en la paleta.
- Al golpear un bloque, este desaparece y se incrementa el contador de bloques destruidos.
- La pelota de Oro vale 5 puntos.
- Si la pelota cae por el borde inferior, pierdes una vida.
- Si pierdes las 3 vidas: **Game Over**.
- Si destruyes todos los bloques: **¡Ganaste!**
