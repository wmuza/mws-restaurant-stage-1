module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
    //Resolution-Switching Cases here

      resolution_switch_case: {
        options: {
          engine: 'im',
          sizes: [{
            /* Change these */
            width: 1600,
            suffix: '_large_2x',
            quality: 30
          },
          { width: 800,
            suffix: '_large_1x',
            quality: 30
          },
          { width: 1280,
            suffix: '_medium_2x',
            quality: 30
          },
          { width: 640,
            suffix: '_medium_1x',
            quality: 30
          },
          { width: 640,
            suffix: '_small_2x',
            quality: 30
          },
          { width: 320,
            suffix: '_small_1x',
            quality: 30
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'img/'
        }]
      },





    // Handling Art-Direction Cases here :)
    large_art_direction: {
        options: {
            sizes: [{ width: 1600, suffix: '_large_2x', quality: 30}, {width: 800, suffix: 'large_1x', quality: 30}]
        },
        files: [{
            expand: true,
            //src: ['**/large_*.{jpg,gif,png}'], //Selects all files that begins with 'large_'
            cwd: 'images_src/art_direction',
            dest: 'img/'
        }]
    },
    medium_art_direction: {
        options: {
            sizes: [{ width: 1280, suffix: '_medium_2x', quality: 30}, {width: 640, suffix: 'medium_1x', quality: 30}]
        },
        files: [{
            expand: true,
            //src: ['**/medium_*.{jpg,gif,png}'], //Selects all files that begins with 'medium_'
            cwd: 'images_src/art_direction',
            dest: 'img/'
        }]
    },
    small_art_direction: {
        options: {
            sizes: [{ width: 640, suffix: '_small_2x', quality: 30}, {width: 320, suffix: 'small_1x', quality: 30}]
        },
        files: [{
            expand: true,
            src: ['**/*.{jpg,gif,png}'], //Selects all files
            cwd: 'images_src/art_direction',
            dest: 'img/'
        }]
    },
},

 // WebP configuration - this convert all images in images/ folder to webp
 // Make sure 'grunt-responsive-image' is run before 'grunt-webp' otherwise images in images/ foler will not be converted (as source for webp plugin is images/ folder)
    webp: {
      files: {
        expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img/',
          dest: 'img/'
      },
      options: {
        binpath: require('webp-bin').path,
        preset: 'photo',
        verbose: true,
        quality: 80,
        alphaQuality: 80,
        compressionMethod: 6,
        segments: 4,
        psnr: 42,
        sns: 50,
        filterStrength: 40,
        filterSharpness: 3,
        simpleFilter: true,
        partitionLimit: 50,
        analysisPass: 6,
        multiThreading: true,
        lowMemory: false,
        alphaMethod: 0,
        alphaFilter: 'best',
        alphaCleanup: true,
        noAlpha: false,
        lossless: false
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['img']
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-webp');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images', 'webp']);

};