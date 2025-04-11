<?php
// Configurar cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Obtener el nombre del archivo solicitado
$filename = isset($_GET['file']) ? $_GET['file'] : '';

// Verificar que el archivo existe y está dentro del directorio de videos
$filepath = __DIR__ . '/' . $filename;
$realpath = realpath($filepath);
$directory = realpath(__DIR__);

// Comprobar que el archivo existe y está dentro del directorio permitido
if ($realpath && strpos($realpath, $directory) === 0 && file_exists($realpath)) {
    // Obtener información del archivo
    $fileinfo = pathinfo($realpath);
    $fileext = strtolower($fileinfo['extension']);

    // Definir tipos de contenido según la extensión
    $content_types = array(
        'mp4' => 'video/mp4',
        'webm' => 'video/webm',
        'ogg' => 'video/ogg',
        'vtt' => 'text/vtt',
        'srt' => 'text/srt',
        'mp3' => 'audio/mpeg'
    );

    // Establecer tipo de contenido
    if (isset($content_types[$fileext])) {
        header('Content-Type: ' . $content_types[$fileext]);
    } else {
        header('Content-Type: application/octet-stream');
    }

    // Establecer cabeceras adicionales
    header('Content-Length: ' . filesize($realpath));
    header('Content-Disposition: inline; filename="' . basename($realpath) . '"');

    // Enviar el archivo
    readfile($realpath);
} else {
    // Si el archivo no existe o está fuera del directorio, devolver 404
    header('HTTP/1.0 404 Not Found');
    echo 'File not found or access denied.';
}
?>
