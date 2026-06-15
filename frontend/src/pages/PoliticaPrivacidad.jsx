export default function PoliticaPrivacidad() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl text-[#3d2314] mb-2">Política de Privacidad</h1>
      <p className="text-sm text-[#3d2314]/50 mb-10">Última actualización: Mayo 2026</p>

      <div className="flex flex-col gap-8 text-sm text-[#3d2314]/80 leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-[#3d2314]">1. Información que recopilamos</h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Nombre y correo electrónico al registrarte</li>
            <li>Datos de pedidos (productos, personalizaciones, dirección de envío)</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-[#3d2314]">2. Cómo usamos tu información</h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Para procesar y gestionar tus pedidos</li>
            <li>Para enviarte confirmaciones y actualizaciones</li>
            <li>No compartimos tu información con terceros</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-[#3d2314]">3. Seguridad</h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Tus datos están protegidos con encriptación</li>
            <li>Las contraseñas se almacenan de forma segura</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-[#3d2314]">4. Tus derechos</h2>
          <p>
            Puedes solicitar eliminar tu cuenta escribiendo a{' '}
            <a href="mailto:informacioncarinitosbyjossy@gmail.com" className="text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520]">
              informacioncarinitosbyjossy@gmail.com
            </a>
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-[#3d2314]">5. Contacto</h2>
          <ul className="flex flex-col gap-1">
            <li>
              Email:{' '}
              <a href="mailto:informacioncarinitosbyjossy@gmail.com" className="text-[#3d2314] underline underline-offset-4 hover:text-[#5a3520]">
                informacioncarinitosbyjossy@gmail.com
              </a>
            </li>
            <li>WhatsApp: (829) 697-8429</li>
            <li>Instagram: @carinitosbyjossy</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
