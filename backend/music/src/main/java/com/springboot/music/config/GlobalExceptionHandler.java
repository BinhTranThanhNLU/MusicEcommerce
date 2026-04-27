package com.springboot.music.config;

import com.springboot.music.exception.EmailAlreadyExistsException;
import com.springboot.music.exception.InvalidCredentialsException;
import com.springboot.music.exception.InvalidRoleException;
import com.springboot.music.responsemodel.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
			MethodArgumentNotValidException ex,
			HttpServletRequest request
	) {
		Map<String, String> fieldErrors = new LinkedHashMap<>();
		for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
			fieldErrors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
		}

		String message = fieldErrors.isEmpty()
				? "Request validation failed"
				: "Validation failed for one or more fields";

		ErrorResponse errorResponse = new ErrorResponse(
				"Bad Request",
				message,
				HttpStatus.BAD_REQUEST.value(),
				request.getRequestURI(),
				Instant.now().toString(),
				fieldErrors
		);

		return ResponseEntity.badRequest().body(errorResponse);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(
			ConstraintViolationException ex,
			HttpServletRequest request
	) {
		ErrorResponse errorResponse = new ErrorResponse(
				"Bad Request",
				ex.getMessage(),
				HttpStatus.BAD_REQUEST.value(),
				request.getRequestURI(),
				Instant.now().toString()
		);

		return ResponseEntity.badRequest().body(errorResponse);
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ErrorResponse> handleInvalidCredentials(
			InvalidCredentialsException ex,
			HttpServletRequest request
	) {
		ErrorResponse errorResponse = new ErrorResponse(
				"Unauthorized",
				ex.getMessage(),
				HttpStatus.UNAUTHORIZED.value(),
				request.getRequestURI(),
				Instant.now().toString()
		);

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleEmailAlreadyExists(
			EmailAlreadyExistsException ex,
			HttpServletRequest request
	) {
		ErrorResponse errorResponse = new ErrorResponse(
				"Conflict",
				ex.getMessage(),
				HttpStatus.CONFLICT.value(),
				request.getRequestURI(),
				Instant.now().toString()
		);

		return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
	}

	@ExceptionHandler(InvalidRoleException.class)
	public ResponseEntity<ErrorResponse> handleInvalidRole(
			InvalidRoleException ex,
			HttpServletRequest request
	) {
		ErrorResponse errorResponse = new ErrorResponse(
				"Bad Request",
				ex.getMessage(),
				HttpStatus.BAD_REQUEST.value(),
				request.getRequestURI(),
				Instant.now().toString()
		);

		return ResponseEntity.badRequest().body(errorResponse);
	}
}

