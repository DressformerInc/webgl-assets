/**
 * Created by Miha-ha on 01.08.14.
 */
var gulp = require('gulp'),
    sequence = require('run-sequence'),
    bump = require('gulp-bump'),
    exec = require('gulp-exec'),
    rimraf = require('gulp-rimraf'),
    paths = {
    };





/**
 * RELEASE
 */

gulp.task('rimraf', function () {
    return gulp.src(['dist/*', 'release.zip'], { read: false })
        .pipe(rimraf());
});

gulp.task('bump', function () {
    return gulp.src(['./package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('git', function () {
    var v = 'v' + require('./package.json').version,
        options = {
            silent: true,
            v: v,
            msg: 'Release ' + v
        };

    return gulp.src('')
        .pipe(exec('git commit -am "<%=options.msg%>"', options))
        .pipe(exec('git tag -a <%=options.v%> -m "<%=options.msg%>"', options))
        .pipe(exec('git push origin --follow-tags')); //отправляю изменения и тэги вместе
//        .pipe(exec('git push origin --tags'));
});

gulp.task('zip', function () {
    return gulp.src('').pipe(exec('cd dist && zip -r ../release.zip ./ && cd ..', {
        silent: true,
        continueOnError: true
    }));
});

gulp.task('deploy-release', function () {
    var v = require('./package.json').version;

    return gulp.src('').pipe(
        exec('ssh deploy@95.163.87.227 test webgl-assets v' + v, {
            silent: false,
            continueOnError: false
        }));
});

gulp.task('log', function () {
    return gulp.src('').pipe(
        exec('ssh deploy@192.168.10.10 tail site-v2.log', {silent: false})
    );
});

gulp.task('github-release', require('./github/release').createAndUpload);

//combo tasks

gulp.task('release', function (cb) {
    sequence(
        'bump',
        'git',
        'zip',
        'github-release',
        'deploy-release',
        'rimraf',
        cb);
});