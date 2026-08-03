document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var name = this.elements.name.value.trim();
      var email = this.elements.email.value.trim();
      var message = this.elements.message.value.trim();
      // The handoff is a mailto:, so this is the last moment the site can
      // see anything. Length of the message stands in for how considered the
      // enquiry was; the name, address, and text itself stay in the browser.
      sigbotTrack('contact_submitted', { message_length: message.length });

      var body = message + '\n\n— ' + name + ' (' + email + ')';
      window.location.href = 'mailto:support@sigbot.co'
        + '?subject=' + encodeURIComponent('Sigbot enquiry from ' + name)
        + '&body=' + encodeURIComponent(body);
    });
