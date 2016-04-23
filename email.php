<?php
		// return "success"; die();
		if($_REQUEST['name_surname'] == '' || $_REQUEST['email'] == '' || $_REQUEST['message'] == ''):
			return "error";
		endif;
		if (filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)):
			// receiver email address
			$to = 'info@outworktime.com';
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
			return $mail ? "success" : "error";
		else:
			return "error";
		endif;

    //Status API Training Shop Blog About

    /*

		<div class="col-sm-12">
		<form class="form-horizontal" role="form" id="formContacto">
			<div class="col-sm-6">
				<div class="form-group">
					<div class="span-form">
						<input class="form-control" type="text" placeholder="Nombre" id="first_name" required="required">
						</div>
						<div class="span-form">
							<input type="text" class="form-control" placeholder="Apellido" id="last_name" required="required">
						</div>
						</div>
						<div class="form-group">
							<input type="email" class="form-control" id="email" placeholder="Direccion de email" required="required">
						</div>
						<div class="form-group">
							<input type="text" class="form-control" id="subject" placeholder="Titulo" required="required">
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group">
							<textarea name="" id="message" class="form-control btn-block" rows="3"></textarea>
						</div>
						<div class="form-group">
							<input type="submit" class="btn btn-block" value="Enviar Mensaje">
						</div>
					</div>
				<div class="col-sm-12">
				<p class="contact-success">Your Message has been Successfully Sent!</p>
				<p class="contact-error">Error! Something went wrong!</p>
			</div>
		</form>

    */
