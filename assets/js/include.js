// include.js
async function includePartials() {
  const slots = Array.from(document.querySelectorAll("[data-include]"));

  // Cargamos todos los parciales en paralelo
  await Promise.all(slots.map(async (slot) => {
    const url = slot.getAttribute("data-include");
    try {
      const resp = await fetch(url, { cache: "no-cache" });
      const html = await resp.text();

      // Creamos un contenedor temporal para manipular el HTML sin perder el slot
      const tmp = document.createElement("div");
      tmp.innerHTML = html.trim();

      // Reemplazamos el slot por el contenido del parcial
      slot.replaceWith(...tmp.childNodes);

      // Disparamos eventos específicos según el archivo
      if (url.includes("navbar")) document.dispatchEvent(new Event("navbar:loaded"));
      if (url.includes("footer")) document.dispatchEvent(new Event("footer:loaded"));
    } catch (e) {
      console.error("No se pudo cargar el parcial:", url, e);
    }
  }));

  // Marcar link activo en navbar
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
    else a.classList.remove("active");
  });

  // Año dinámico en footer
  const y = document.getElementById("footer-year");
  if (y) y.textContent = new Date().getFullYear();
}

// Ejecutar lo antes posible, pero tras tener el DOM básico
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", includePartials);
} else {
  includePartials();
}
