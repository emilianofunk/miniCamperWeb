<?php
  header("Content-Type: text/html");
  include dirname(__FILE__) . '/includes/AltoRouter.php';
  $router = new AltoRouter();
  $router->setBasePath('');
  /* Setup the URL routing. This is production ready. */
  // Main routes that non-customers see
  $router->map('GET','/', 'index-s.html', 'home');
  //$router->map('GET','/', 'index-b.html', 'build');
  $router->map('GET','/catalogo/', 'catalogo.html');


  /* Match the current request */
  $match = $router->match();
  if($match) {
    require $match['target'];
  }
  else {
    header("HTTP/1.0 404 Not Found");
    require '404.html';
  }
?>