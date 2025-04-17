import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Se requieren las variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  const adminEmail = "admin@sagrapp.com"
  const adminPassword = "Sagrapp2023!"
  const adminName = "Administrador"

  try {
    // Verificar si el usuario ya existe
    const { data: existingUsers, error: searchError } = await supabase.from("users").select("*").eq("email", adminEmail)

    if (searchError) {
      throw searchError
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log("El usuario administrador ya existe.")

      // Actualizar el rol a admin si no lo es
      if (existingUsers[0].role !== "admin") {
        const { error: updateError } = await supabase
          .from("users")
          .update({ role: "admin" })
          .eq("id", existingUsers[0].id)

        if (updateError) {
          throw updateError
        }

        console.log("El rol del usuario ha sido actualizado a admin.")
      }

      return
    }

    // Crear el usuario en auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: adminName },
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error("No se pudo crear el usuario en auth")
    }

    // Actualizar el rol a admin en la tabla users
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: "admin", name: adminName })
      .eq("id", authData.user.id)

    if (updateError) {
      throw updateError
    }

    console.log("Usuario administrador creado exitosamente:")
    console.log("Email:", adminEmail)
    console.log("Password:", adminPassword)
    console.log("Rol: admin")
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error)
  } finally {
    process.exit(0)
  }
}

createAdminUser()
