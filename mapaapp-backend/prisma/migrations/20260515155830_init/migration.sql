-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "nombre_agricultor" TEXT NOT NULL,
    "tipo_plantacion" TEXT NOT NULL,
    "comentario" TEXT,
    "imagen_url" TEXT,
    "hectareas" DOUBLE PRECISION NOT NULL,
    "vertices" JSONB NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Agregar columna de geometria PostGIS a la tabla de areas
-- GEOMETRY(Polygon, 4326) = un poligono con coordenadas geograficas
-- 4326 = sistema de coordfenadas WGS84 que seria los que usan GPS y Google maps
ALTER TABLE areas ADD COLUMN geometry GEOMETRY(Polygon, 4326);

-- crear un indice espacial para las busquedas rapidas
-- GIST es el tipo de indice que PostGIS usa para las geometrias
CREATE INDEX areas_geometry_idx ON areas USING GIST (geometry);