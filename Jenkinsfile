#!/usr/bin/env groovy

def cleanup_workspace() {
  cleanWs()
  dir("${env.WORKSPACE}@tmp") {
    deleteDir()
  }
  dir("${env.WORKSPACE}@script") {
    deleteDir()
  }
  dir("${env.WORKSPACE}@script@tmp") {
    deleteDir()
  }
}

def npm_install_command = 'npm install --ignore-scripts'

pipeline {
  agent any
  tools {
    nodejs "node-lts"
  }
  environment {
    NPM_RC_FILE = 'process-engine-ci-token'
    NODE_JS_VERSION = 'node-lts'
  }

  stages {
    stage('Prepare') {
      steps {
        dir('typescript') {

          script {
            raw_package_version = sh(script: 'node --print --eval "require(\'./package.json\').version"', returnStdout: true).trim()
            package_version = raw_package_version.trim()
            echo("Package version is '${package_version}'")

            def run_clean_install = env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'develop';
            if (run_clean_install) {
              npm_install_command = 'npm ci --ignore-scripts'
            }
          }
          nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
            sh('node --version')
            sh(npm_install_command)
          }
        }
      }
    }
    stage('Lint') {
      steps {
        dir('typescript') {
          sh('node --version')
          sh('npm run lint')
        }
      }
    }
    stage('Build') {
      steps {
        dir('typescript') {
          sh('node --version')
          sh('npm run build')
        }
      }
    }
    stage('Test') {
      steps {
        dir('typescript') {
          sh('node --version')
          sh('npm run test')
        }
      }
    }
    stage('Publish') {
      steps {
        dir('typescript') {
          script {
            def branch = env.BRANCH_NAME;
            def branch_is_master = branch == 'master';
            def new_commit = env.GIT_PREVIOUS_COMMIT != env.GIT_COMMIT;

            if (branch_is_master) {

              def previous_build = currentBuild.getPreviousBuild();
              def previous_build_status = previous_build == null ? null : previous_build.result;

              def should_publish_to_npm = new_commit || previous_build_status == 'FAILURE';

              if (should_publish_to_npm) {
                script {
                  // let the build fail if the version does not match normal semver
                  def semver_matcher = package_version =~ /\d+\.\d+\.\d+/;
                  def is_version_not_semver = semver_matcher.matches() == false;
                  if (is_version_not_semver) {
                    error('Only non RC Versions are allowed in master')
                  }
                }

                def raw_package_name = sh(script: 'node --print --eval "require(\'./package.json\').name"', returnStdout: true).trim()
                def current_published_version = sh(script: "npm show ${raw_package_name} version", returnStdout: true).trim();
                def version_has_changed = current_published_version != raw_package_version;

                if (version_has_changed) {
                  nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
                    sh('node --version')
                    sh('npm publish --ignore-scripts')
                  }
                } else {
                  println 'Skipping publish for this version. Version unchanged.'
                }
              } else {
                println 'Skipped publishing for this version. No new commits pushed and previous build did not fail.'
              }

            } else {
              // when not on master, publish a prerelease based on the package version, the
              // current git commit and the build number.
              // the published version gets tagged as the branch name.
              def first_seven_digits_of_git_hash = env.GIT_COMMIT.substring(0, 8);
              def publish_version = "${package_version}-${first_seven_digits_of_git_hash}-b${env.BUILD_NUMBER}";
              def publish_tag = branch.replace("/", "~");

              nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
                sh('node --version')
                sh("npm version ${publish_version} --no-git-tag-version --force")
                sh("npm publish --tag ${publish_tag} --ignore-scripts")
              }
            }
          }
        }
      }
    }
    stage('Cleanup') {
      steps {
        script {
          // this stage just exists, so the cleanup-work that happens in the post-script
          // will show up in its own stage in Blue Ocean
          sh(script: ':', returnStdout: true);
        }
      }
    }
  }
  post {
    always {
      script {
        cleanup_workspace();
      }
    }
  }
}
