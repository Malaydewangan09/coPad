package main

import (
	"context"
	"io/ioutil"
	"net/smtp"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	emailSettings EmailSettings
}

// EmailSettings struct to store user's email configuration
type EmailSettings struct {
	Email    string
	Password string
	SMTPHost string
	SMTPPort string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// OpenFile opens a file dialog and returns the content of the selected file
func (a *App) OpenFile() string {
	filename, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Text Files (*.txt)", Pattern: "*.txt"},
			{DisplayName: "All Files (*.*)", Pattern: "*.*"},
		},
	})

	if err != nil {
		return "Error opening file dialog: " + err.Error()
	}

	if filename == "" {
		return ""
	}

	content, err := ioutil.ReadFile(filename)
	if err != nil {
		return "Error reading file: " + err.Error()
	}

	return string(content)
}

// SaveFile saves content to a file, using a file dialog
func (a *App) SaveFile(content string) string {
	filename, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title: "Save File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Text Files (*.txt)", Pattern: "*.txt"},
			{DisplayName: "All Files (*.*)", Pattern: "*.*"},
		},
	})

	if err != nil {
		return "Error opening save dialog: " + err.Error()
	}

	if filename == "" {
		return ""
	}

	err = ioutil.WriteFile(filename, []byte(content), 0644)
	if err != nil {
		return "Error saving file: " + err.Error()
	}

	return "File saved successfully"
}

func (a *App) UpdateEmailSettings(email, password, smtpHost, smtpPort string) string {
	a.emailSettings = EmailSettings{
		Email:    email,
		Password: password,
		SMTPHost: smtpHost,
		SMTPPort: smtpPort,
	}
	return "Email settings updated successfully"
}

// SendEmail sends an email with the given content using the user's email settings
func (a *App) SendEmail(to, subject, body string) string {
	if a.emailSettings.Email == "" || a.emailSettings.Password == "" {
		return "Email settings not configured"
	}

	auth := smtp.PlainAuth("", a.emailSettings.Email, a.emailSettings.Password, a.emailSettings.SMTPHost)

	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	err := smtp.SendMail(a.emailSettings.SMTPHost+":"+a.emailSettings.SMTPPort, auth, a.emailSettings.Email, []string{to}, msg)
	if err != nil {
		return "Error sending email: " + err.Error()
	}

	return "Email sent successfully"
}
