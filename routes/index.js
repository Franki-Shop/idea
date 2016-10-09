var express = require('express');
var router = express.Router();
var ajaxRender = require('../controllers/partial-form-renderer');
var helper = require('../lib/helper');


/* Try now */
router.get('/try', function(req, res, next) {
  helper.setInitialModel(req, res);
  res.render('try', req.model);
});

/* Gallery */
router.get('/gallery', function(req, res, next) {
  res.render('gallery');
});

router.post('/try', function(req, res, next) {
  helper.setInitialModel(req, res);
  if (req.headers['content-type'] === 'application/json') {
    return ajaxRender(req, res, next);
  }

  console.log(req.body);
  if (req.body.hasOwnProperty('generate')) {
    var error = {};
    if (req.body.i1 === '') {
      error = Object.assign({}, error, {
        i1: 'required'
      });
    }
    if (req.body.i2 === '') {
      error = Object.assign({}, error, {
        i2: 'required'
      });
    }
    if (req.body.i3 === '') {
      error = Object.assign({}, error, {
        i3: 'required'
      });
    }

    if (req.body.i4 === '') {
      error = Object.assign({}, error, {
        i4: 'required'
      });
    }

    if (req.body.i5 && req.body.i5 === 'true') {
      if (req.body.i5a && req.body.i5a[0] === '') {
        error = Object.assign({}, error, {
          i5a_0: 'required'
        });
      }

      if (req.body.i5a && req.body.i5a[1] === '') {
        error = Object.assign({}, error, {
          i5a_1: 'required'
        });
      }

      if (req.body.i5a && req.body.i5a[2] === '') {
        error = Object.assign({}, error, {
          i5a_2: 'required'
        });
      }
    }

    if (!req.body.hasOwnProperty('i6') || req.body.i6.length === 0) {
      error = Object.assign({}, error, {
        i6: 'Select atleast one call to action button'
      });
    }

    if (req.body.i6 && Array.isArray(req.body.i6) && req.body.i6.length > 2) {
      error = Object.assign({}, error, {
        i6: 'You can have max 2 call to action buttons'
      });
    }

    if (req.body.i7 === '') {
      error = Object.assign({}, error, {
        i6: 'Add atleast one call to action button'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('website') >= 0 &&
      req.body
      .i7a === '') {
      error = Object.assign({}, error, {
        i7a: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('website') >= 0 &&
      req.body
      .i7b === '') {
      error = Object.assign({}, error, {
        i7b: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('website') >= 0 &&
      !helper.validateURL(req.body
        .i7b)) {
      error = Object.assign({}, error, {
        i7b: 'Enter a valid website URL'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('buy') >= 0 && req.body
      .i7c === '') {
      error = Object.assign({}, error, {
        i7c: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('buy') >= 0 && !
      helper.validateEmail(req.body
        .i7c)) {
      error = Object.assign({}, error, {
        i7c: 'Enter a valid email address'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('buy') >= 0 && req.body
      .i7d === '') {
      error = Object.assign({}, error, {
        i7d: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('donate') >= 0 && req
      .body
      .i7e === '') {
      error = Object.assign({}, error, {
        i7e: 'required'
      });
    }

    if (req.body.i7 && req.body.i7.split(',').indexOf('donate') >= 0 && !
      helper.validateEmail(req
        .body
        .i7e)) {
      error = Object.assign({}, error, {
        i7e: 'Enter a valid email address'
      });
    }

    if (req.body.i9 && req.body.i9 === 'true' && req.body.i9a === '') {
      error = Object.assign({}, error, {
        i9a: 'required'
      });
    }

    if (req.body.i9 && req.body.i9 === 'true' && !helper.validateEmail(req
        .body.i9a)) {
      error = Object.assign({}, error, {
        i9a: 'Enter a valid email address'
      });
    }

    if (Array.isArray(req.body.i10)) {
      req.body.i10.forEach(function(val, index) {
        if (val === '') {
          req.model.i10[index].urlError = error['i10_' + index] =
            'required';
        }
      });
    }
    if (Array.isArray(req.body.i11)) {
      req.body.i11.forEach(function(val, index) {
        if (val === '') {
          req.model.i10[index].titleError = error['i11_' + index] =
            'required';
        }
      });
    }

    //*********************//
    if (Object.keys(error).length !== 0) {
      console.log('***** form had errors: ', error);
      res.render('try', Object.assign({}, {
        error: error
      }, req.body, req.model));
    } else { // generate
      helper.mixBodyInModel(req, res, function(err) {
        if (err) {
          console.log('errrr', err);
          res.render('try', req.body); // @TODO: Indicate error.
        } else {
          console.log(req.model);
          res.render('success', req.model);
        }
      });
    }
    //*********************//
  } else if (req.body.hasOwnProperty('add_buzzwords')) {
    res.render('try', Object.assign({}, req.body, req.model, {
      i5: 'true'
    }));
  } else if (req.body.hasOwnProperty('add_subscribe')) {
    res.render('try', Object.assign({}, req.body, req.model, {
      i9: 'true'
    }));
  } else if (req.body.hasOwnProperty('add_call_to_action')) {
    if (req.body.i6 && Array.isArray(req.body.i6) && req.body.i6.length > 2) {
      res.render('try', Object.assign({}, req.body, req.model, {
        error: {
          i6: 'You can have max 2 call to action buttons'
        }
      }));
    } else if (typeof req.body.i6 === 'undefined' || req.body.i6.length ===
      0) {
      res.render('try', Object.assign({}, req.body, req.model, {
        error: {
          i6: 'Select atleast one call to action button'
        }
      }));
    } else {
      res.render('try', Object.assign({}, req.body, req.model, {
        i7: (Array.isArray(req.body.i6)) ? req.body.i6.join(',') : req
          .body.i6
      }));
    }
  } else if (req.body.hasOwnProperty('add_image')) {
    req.model.i10.push({
      src: '',
      title: ''
    });

    res.render('try', Object.assign({}, {
      error: error
    }, req.body, req.model));
  }
});

router.get('/landing/:path/edit', function(req, res) {
  helper.createModel(req, res, function(err) {
    if (err) {
      //redirecting to /try
      return res.redirect('/try');
    }
    res.render('try', req.model);
  });
});

/* Donation */
router.get('/donate/', function(req, res, next) {
  /* Decide redirect based on stored configuration */
  res.redirect(
    'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=abhastandon007@gmail.com&item_name=Support+IdeaDeck'
  );
});

/* POST subscribe form */
router.post('/subscribe/:id?', function(req, res, next) {
  var id = (req.params.id) ? req.params.id :
    'abhastandon007+subscribe@gmail.com';
  if (!helper.validateEmail(req.body.email)) {
    var err = new Error('Please enter a valid email address to subscribe');
    err.status = 400;
    return next(err);
  }
  res.redirect(301,
    'mailto:' + id + '?subject=Subscribe&body=' + req.body.email
  );
});

/*
// Uncomment for testing
router.get('/test', function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  // make this as single call later
  var a = compiledFunction({
    absolutePath: "https://github.com/ideaDeck/#",
    about: "Lightweight web-app to generate idea deck with call to action buttons",
    description: 'Helping innovators, entrepreneurs, and non-profits clearly and concisely explain their idea and product.',
    ideas: ['Over 100 million businesses are launched annually.',
      'Innovators need ways to convey their idea clearly to their audience.',
      'IdeaDeck: Easily create, host and share your ideas with call to action buttons.',
      "Works on all devices, ultra-light weight (~ 4 KB) and doesn't require any javascript."
    ], // exactly 3 - no more, no less
    highlights: [{
      "title": "Highlight 1",
      "description": " Some stuff to boost here"
    }, {
      "title": "Highlight 2",
      "description": " Some stuff to boost here"
    }, {
      "title": "Highlight 3",
      "description": " Some stuff to boost here"
    }],
    website: { // can be undefined
      'title': 'try',
      'url': 'http://foo.com'
    },
    donate: { // can be undefined
      'email': 'foo@gmail.com'
    },
    subscribe: {
      "email": 'email@gmail.com'
    },
    images: [{
      "title": "mario",
      "src": "mario.png"
    }],
    footer: 'Test test',
    witty_note: "Try IdeaDeck For Free, Or Buy Us A Coffee :)",
    sharing: true,
    title: "IdeaDeck"
  });
  console.log(a);
  res.write(a);
  res.end();
});
*/

module.exports = router;
