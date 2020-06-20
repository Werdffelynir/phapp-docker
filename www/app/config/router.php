<?php

$router = $di->getRouter();

$router->add('/', [
        'controller' => 'index',
        'action'     => 'index',
    ]
);

$router->add('/register', [
        'controller' => 'login',
        'action'     => 'register',
    ]
);

$router->add('/signin', [
        'controller' => 'login',
        'action'     => 'signin',
    ]
);
$router->add('/signout', [
        'controller' => 'login',
        'action'     => 'signout',
    ]
);

$router->notFound([
    'controller' => 'index',
    'action' => 'notfound'
]);

$router->handle($_SERVER['REQUEST_URI']);
