#!/bin/bash

# usage:
# type "bash create-page.sh" in terminal
# type page name in snake_case and press Enter

# for example: "home", "about", "contact", "master-class" etc

# don't forget add route to enum ROUTE_TYPE in src/types/enums.ts
# don't forget add route to src/router/routes.ts

read -p "Enter page name: " PAGE

PAGE_LC="${PAGE,,}"

PAGE_PC=$(echo ${PAGE_LC^} | sed -r 's/(^|-)(.)/\U\2/g')

echo 'create page: '$PAGE_PC'Page.vue in src/pages/'$PAGE_LC

FILE_PAGE='src/pages/'$PAGE_LC'/'$PAGE_PC'Page.vue'

mkdir -p 'src/pages/'$PAGE_LC

echo '<template>
  <q-page class="row items-center justify-evenly page-'$PAGE_LC'">
    <div class="container">
      '$PAGE_PC' Page
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@import "./scss/page-'$PAGE_LC'"
</style>' > $FILE_PAGE


echo 'create scss: page-'$PAGE_LC'.scss in src/pages/'$PAGE_LC'/scss'

mkdir -p 'src/pages/'$PAGE_LC'/scss'

echo '.page-'$PAGE_LC' {
  background-color: $content-bg-color;
}' > 'src/pages/'$PAGE_LC'/scss/page-'$PAGE_LC'.scss'
