<?php
declare(strict_types=1);

use Phalcon\Http\Response;


class LoginController extends \Phalcon\Mvc\Controller
{

    public function initialize()
    {
        $this->view->setLayout('login');
    }

    public function indexAction()
    {
        $this->initialize();
    }

    public function signoutAction()
    {
        $this->session->destroy();
        $this->response->redirect('/signin');
    }

    public function registerAction()
    {
        $this->initialize();

        $email = $this->request->getPost('email', 'string');
        $username = $this->request->getPost('username', 'string');
        $password = $this->request->getPost('password', 'string');

        if (!empty($username) && !empty($password) &&
            strlen($username) > 4 && strlen($password) > 4
        ) {
            $user = new Users();

            $userExist = Users::findFirst([
                'conditions' => 'email = :email:',
                'bind'       => [
                    'email' => $email,
                ],
            ]);

            if (!$userExist) {
                $user->email = $email;
                $user->username = $username;
                $user->password = $this->security->hash($password);

                $status = $user->create();
                $messages = $user->getMessages();
            } else {
                $status = false;
                $messages = "Email address is exist!";
            }

            if ($status) {
                $this->session->set('userEmail', $user->email);
            }

            $response = new Response();

            // tmp
            //if ($status)
            //    return $this->response->redirect('/');

            return $response->setJsonContent([
                "status" => $status ? "OK" : "ERROR",
                "message" => $messages,
            ]);
        }

        return $this->view->partial('login/register');
    }

    public function signinAction()
    {
        $this->initialize();

        $username = $this->request->getPost('username', 'string');
        $password = $this->request->getPost('password', 'string');


        if (!empty($username) && !empty($password) &&
            strlen($username) > 4 && strlen($password) > 4
        ) {
            $response = new Response();

            $user = Users::findFirst([
                'conditions' => 'username = :username:',
                'bind'       => [
                    'username' => $username,
                ],
            ]);

            if ($user) {
                $check = $this->security->checkHash($password, $user->password);

                if ($check) {
                    $this->session->set('userEmail', $user->email);
                }

                return $response->setJsonContent([
                    "status" => $check ? "OK" : "ERROR",
                    "message" => $check ? "" : "Wrong password",
                ]);

            } else {
                return $response->setJsonContent([
                    "status" => "ERROR",
                    "message" => "Users not exist",
                ]);
            }
        }

        return $this->view->partial('login/signIn');
    }

}

