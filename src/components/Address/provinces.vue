<template>
  <el-cascader :props="props" @change="handleChange"  v-model="address" style="width: 100%"/>
  </el-form-item>
</template>
<script>
import { fetchProvinces, fetchCities, fetchDistricts } from '@/api/address'
export default {
  name: 'Customer',
  props: {
    provinceCityDistrict: {
      default: '',
      type: Array
    }
  },
  watch: {
    provinceCityDistrict(newVal, oldVal) {
      this.address = newVal
    }
  },
  data() {
    return {
      address: null,
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      }
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    lazyLoad(node, resolve) {
      const that = this
      setTimeout(() => {
        if (node.level == 0) {
          that.getProvinces(node, resolve)
        } else if (node.level == 1) {
          that.getCities(node.value, node, resolve)
        } else if (node.level == 2) {
          that.getDistricts(node.value, node, resolve)
        } else {
          resolve(node)
        }
      }, 10)
    },
    // 获取省份信息
    getProvinces(node, resolve) {
      const that = this
      fetchProvinces().then(response => {
        if (response.code == 0) {
          const nodes = response.data.provinces.map(item => ({
            value: item,
            label: item
          }))
          resolve(nodes)
        }
      })
    },
    // 获取城市信息
    getCities(name, node, resolve) {
      const that = this
      const tem = {
        province_name: name
      }
      fetchCities(tem).then(response => {
        if (response.code == 0) {
          const nodes = response.data.cities.map(item => ({
            value: item,
            label: item
          }))
          resolve(nodes)
        }
      })
    },
    // 获取区域信息
    getDistricts(name, node, resolve) {
      const that = this

      const tem = {
        city_name: name
      }
      fetchDistricts(tem).then(response => {
        if (response.code == 0) {
          const nodes = response.data.districts.map(item => ({
            value: item,
            label: item,
            leaf: node.level >= 2
          }))
          resolve(nodes)
        }
      })
    },
    handleChange(value) {
      this.provinceCityDistrict = value
      this.address = value
    }
  }
}

</script>
