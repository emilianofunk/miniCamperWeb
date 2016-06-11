<?php
		// return "success"; die();
		if($_REQUEST['name_surname'] == '' || $_REQUEST['email'] == '' || $_REQUEST['message'] == ''):
			return "error";
		endif;
		if (filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)):
			// receiver email address
			if($_REQUEST['email'] == 'Compra') {
			    $to = 'compras@outworktime.com';
			} else {
			    $to = 'info@outworktime.com';
			}
			// prepare header
			$header = 'From: '. $_REQUEST['name_surname'] . ' <'. $_REQUEST['email'] .'>'. "\r\n";
			$header .= 'Reply-To:  '. $_REQUEST['name_surname'] . ' <'. $_REQUEST['email'] .'>'. "\r\n";
			// $header .= 'Cc:  ' . 'example@domain.com' . "\r\n";
			// $header .= 'Bcc:  ' . 'example@domain.com' . "\r\n";
			$header .= 'X-Mailer: PHP/' . phpversion();
			// Contact Subject
			//$subject = $_REQUEST['subject'];
			$subject = 'Consulta: ';
			// Contact Message
			$message = $_REQUEST['message'];
			// Send contact information
			$mail = mail( $to, $subject , $message, $header );
			var_dump($mail);
			return $mail ? "success" : "error";
		else:
			return "error";
		endif;
