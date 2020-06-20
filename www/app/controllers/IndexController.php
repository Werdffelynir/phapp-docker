<?php
declare(strict_types=1);

use \Phalcon\Http\Response;


class IndexController extends ControllerBase
{

    public function indexAction()
    {
        $this->initialize();

        $userEmail = $this->session->get('userEmail');

        if ($userEmail) {
            $user = Users::findFirst([
                'conditions' => 'email = :email:',
                'bind'       => [
                    'email' => $userEmail,
                ],
            ]);

            $this->view->setVar('welcome', 'Welcome ' .$user->username. ' to Dashboard');

            $this->view->setVar('user', [
                'username' => $user->username,
                'email' => $user->email,
            ]);

        } else {

            $this->response->redirect('/signin');
        }

    }

    public function notfoundAction()
    {
        $response = new Response(
            'Sorry, the page doesn\'t exist',
            404,
            'Not Found');

        $response->send();
    }

}

